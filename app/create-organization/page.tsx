import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { OrganizationForm } from "@/components/organizations/organization-form"
import { Card } from "@/components/ui/card"

export default async function NewOrganizationPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Criar Organização</h1>
          <p className="text-gray-600">Configure sua nova organização</p>
        </div>
        
        <OrganizationForm />
      </Card>
    </div>
  )
}