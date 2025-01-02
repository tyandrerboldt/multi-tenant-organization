import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card } from "@/components/ui/card"
import { RoleList } from "@/components/roles/role-list"
import { AddRoleDialog } from "@/components/roles/add-role-dialog"
import { getRoles } from "@/lib/actions/roles"

interface RolesPageProps {
  params: {
    slug: string
  }
}

export default async function RolesPage({ params }: RolesPageProps) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  const organization = await prisma.organization.findFirst({
    where: {
      slug: params.slug,
      memberships: {
        some: {
          userId: session.user.id,
          role: "OWNER"
        }
      }
    }
  })

  if (!organization) {
    redirect("/app")
  }

  const roles = await getRoles(organization.id)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Funções</h1>
          <p className="text-gray-600">
            Gerencie as funções e permissões da sua organização
          </p>
        </div>
        <AddRoleDialog organizationId={organization.id} />
      </div>

      <Card className="p-6">
        <RoleList
          roles={roles}
          organizationId={organization.id}
        />
      </Card>
    </div>
  )
}