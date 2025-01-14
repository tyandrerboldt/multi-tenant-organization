import { Card } from "@/components/ui/card"
import { PropertyForm } from "@/components/properties/property-form"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getProperty } from "@/lib/actions/properties"

interface EditPropertyPageProps {
  params: {
    slug: string
    id: string
  }
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
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

  const property = await getProperty(organization.id, params.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Editar Imóvel</h1>
        <p className="text-gray-600">
          Atualize as informações do imóvel
        </p>
      </div>

      <Card className="p-6">
        <PropertyForm 
          organizationId={organization.id}
          property={property}
        />
      </Card>
    </div>
  )
}