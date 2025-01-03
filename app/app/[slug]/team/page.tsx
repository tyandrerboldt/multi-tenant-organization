import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card } from "@/components/ui/card"
import { InviteMemberForm } from "@/components/team/invite-member-form"
import { MemberList } from "@/components/team/member-list"
import { getTeamMembers } from "@/lib/actions/team"
import { getRoles } from "@/lib/actions/roles"
import { getServerSession } from "next-auth/next"
import { Role } from "@prisma/client"
import { getOrganizationUsage } from "@/lib/plans/usage"
import { getPlanResourceLimit } from "@/lib/plans/limits"

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
    redirect("/app")
  }

  const [members, customRoles, usage] = await Promise.all([
    getTeamMembers(organization.id),
    getRoles(organization.id),
    getOrganizationUsage(organization.id)
  ])
  
  const currentMembership = members.find(
    member => member.user.id === session.user.id
  )
  
  const isOwner = currentMembership?.role === Role.OWNER
  const memberLimit = getPlanResourceLimit(organization.plan, "members")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Team Members</h1>
        <p className="text-gray-600">
          Manage your organization&apos;s team members ({usage.members - 1} of {memberLimit === Infinity ? "unlimited" : memberLimit})
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Current Members</h2>
        <MemberList
          organizationId={organization.id}
          members={members.filter(mb => mb.role != "OWNER")}
          customRoles={customRoles}
          currentUserId={session.user.id}
          isOwner={isOwner}
        />
      </Card>

      {isOwner && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Invite New Member</h2>
          <InviteMemberForm 
            organizationId={organization.id}
            customRoles={customRoles}
            plan={organization.plan}
            currentUsage={usage.members - 1}
          />
        </Card>
      )}
    </div>
  )
}