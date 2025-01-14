import { Card } from "@/components/ui/card"
import { PropertyForm } from "@/components/properties/property-form"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

interface AddPropertyPageProps {
  params: {
    slug: string
  }
}

export default async function AddPropertyPage({ params }: AddPropertyPageProps) {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Adicionar Imóvel</h1>
        <p className="text-gray-600">
          Cadastre um novo imóvel no sistema
        </p>
      </div>

      <Card className="p-6">
        <PropertyForm organizationId={organization.id} />
      </Card>
    </div>
  )
}