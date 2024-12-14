import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { OrganizationSettingsForm } from "@/components/settings/organization-settings-form"
import { DeleteOrganization } from "@/components/settings/delete-organization"

interface SettingsPageProps {
  params: {
    slug: string
  }
}

export default async function SettingsPage({ params }: SettingsPageProps) {
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

  const membership = await prisma.membership.findFirst({
    where: {
      organizationId: organization.id,
      userId: session.user.id,
    },
  })

  const isOwner = membership?.role === "OWNER"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Organization Settings</h1>
        <p className="text-gray-600">
          Manage your organization&apos;s settings and preferences.
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">General Settings</h2>
        <OrganizationSettingsForm organization={organization} />
      </Card>

      {isOwner && (
        <Card className="p-6 border-red-200">
          <h2 className="text-lg font-semibold mb-4">Danger Zone</h2>
          <p className="text-gray-600 mb-4">
            Once you delete an organization, there is no going back.
            Please be certain.
          </p>
          <DeleteOrganization organization={organization} />
        </Card>
      )}
    </div>
  )
}