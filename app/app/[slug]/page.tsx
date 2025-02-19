import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

interface DashboardPageProps {
  params: {
    slug: string
  }
}

export default async function DashboardPage({ params }: DashboardPageProps) {
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Bem vindo a {organization.name}
      </h1>
      <p className="text-gray-600">
        Essa é a dashboard da sua organização.
      </p>
    </div>
  )
}