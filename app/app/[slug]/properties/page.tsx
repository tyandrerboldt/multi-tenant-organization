import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"
import { PropertyList } from "@/components/properties/property-list"
import { getProperties } from "@/lib/actions/properties"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

interface PropertiesPageProps {
  params: { 
    slug: string 
  }
  searchParams: {
    page?: string
    search?: string
    status?: string
    type?: string
    highlight?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
  }
}

export default async function PropertiesPage({ 
  params,
  searchParams
}: PropertiesPageProps) {
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

  const { properties, totalPages, currentPage, total } = await getProperties({
    organizationId: organization.id,
    page: searchParams.page ? parseInt(searchParams.page) : 1,
    search: searchParams.search,
    status: searchParams.status as any,
    type: searchParams.type as any,
    highlight: searchParams.highlight as any,
    sortBy: searchParams.sortBy,
    sortOrder: searchParams.sortOrder,
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Imóveis</h1>
          <p className="text-gray-600">
            Gerencie os imóveis da sua organização ({total} imóveis)
          </p>
        </div>
        <Button asChild>
          <Link href={`/app/${params.slug}/properties/add`}>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar
          </Link>
        </Button>
      </div>

      <Card className="p-6">
        <PropertyList
          properties={properties}
          currentPage={currentPage}
          totalPages={totalPages}
          baseUrl={`/app/${params.slug}/properties`}
        />
      </Card>
    </div>
  )
}