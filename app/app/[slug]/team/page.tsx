import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card } from "@/components/ui/card"
import { InviteMemberDialog } from "@/components/team/invite-member-dialog"
import { MemberList } from "@/components/team/member-list"
import { getTeamMembers } from "@/lib/actions/team"
import { getRoles } from "@/lib/actions/roles"
import { getServerSession } from "next-auth/next"
import { Role } from "@prisma/client"
import { getOrganizationUsage } from "@/lib/plans/usage"
import { getPlanResourceLimit } from "@/lib/plans/limits"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"

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
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Membros da Equipe</h1>
          <p className="text-gray-600">
            Gerencie os membros da sua organização ({usage.members - 1} de {memberLimit === Infinity ? "ilimitado" : memberLimit})
          </p>
        </div>

        {isOwner && (
          <InviteMemberDialog
            trigger={
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Convidar
              </Button>
            }
            organizationId={organization.id}
            customRoles={customRoles}
            plan={organization.plan}
            currentUsage={usage.members - 1}
          />
        )}
      </div>

      <Card className="p-6">
        <MemberList
          organizationId={organization.id}
          members={members.filter(mb => mb.role != "OWNER")}
          customRoles={customRoles}
          currentUserId={session.user.id}
          isOwner={isOwner}
        />
      </Card>
    </div>
  )
}