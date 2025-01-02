import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card } from "@/components/ui/card"
import { DomainList } from "@/components/domains/domain-list"
import { AddDomainDialog } from "@/components/domains/add-domain-dialog"
import { getDomains } from "@/lib/actions/domain"
import { checkPermission } from "@/lib/actions/roles"

interface DomainsPageProps {
  params: {
    slug: string
  }
  searchParams: {
    page?: string
  }
}

export default async function DomainsPage({ 
  params,
  searchParams,
}: DomainsPageProps) {
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

  // Check read permission
  const canRead = await checkPermission(
    session.user.id,
    organization.id,
    "domains",
    "read"
  )

  if (!canRead) {
    redirect(`/app/${params.slug}`)
  }

  const page = Number(searchParams.page) || 1
  const { domains, totalPages, currentPage } = await getDomains(organization.id, page)

  // Check create permission for showing add button
  const canCreate = await checkPermission(
    session.user.id,
    organization.id,
    "domains",
    "create"
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Domains</h1>
          <p className="text-gray-600">
            Manage your organization's domains.
          </p>
        </div>
        {canCreate && (
          <AddDomainDialog organizationId={organization.id} />
        )}
      </div>

      <Card className="p-6">
        <DomainList
          domains={domains}
          organizationId={organization.id}
          currentPage={currentPage}
          totalPages={totalPages}
          canUpdate={await checkPermission(
            session.user.id,
            organization.id,
            "domains",
            "update"
          )}
          canDelete={await checkPermission(
            session.user.id,
            organization.id,
            "domains",
            "delete"
          )}
        />
      </Card>
    </div>
  )
}