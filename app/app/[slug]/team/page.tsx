import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { InviteMemberForm } from "@/components/team/invite-member-form"
import { MemberList } from "@/components/team/member-list"
import { getTeamMembers } from "@/lib/actions/team"
import { getServerSession } from "next-auth/next"

interface TeamPageProps {
  params: {
    slug: string
  }
}

export default async function TeamPage({ params }: TeamPageProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  const organization = await prisma.organization.findFirst({
    where: {
      slug: params.slug,
      memberships: {
        some: {
          userId: session.user.id
        }
      }
    }
  })

  if (!organization) {
    redirect("/create-organization")
  }

  const members = await getTeamMembers(organization.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Team Members</h1>
        <p className="text-gray-600">
          Manage your organization&apos;s team members and their roles.
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Current Members</h2>
        <MemberList
          organizationId={organization.id}
          members={members}
          currentUserId={session.user.id}
        />
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Invite New Member</h2>
        <InviteMemberForm organizationId={organization.id} />
      </Card>
    </div>
  )
}