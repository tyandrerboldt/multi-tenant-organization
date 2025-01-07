import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Card } from "@/components/ui/card"
import { PreferencesForm } from "@/components/preferences/preferences-form"
import { getUserOrganizations } from "@/lib/actions/organization"
import { getUserPreferences } from "@/lib/actions/preferences"

export default async function PreferencesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  const [organizations, preferences] = await Promise.all([
    getUserOrganizations(),
    getUserPreferences(),
  ])

  return (
    <div className="container max-w-2xl py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Preferências</h1>
        <p className="text-gray-600">
          Personalize sua experiência no sistema
        </p>
      </div>

      <Card className="p-6">
        <PreferencesForm
          organizations={organizations}
          defaultValues={{
            defaultOrganizationId: preferences?.defaultOrganizationId,
            theme: preferences?.theme || "light",
          }}
        />
      </Card>
    </div>
  )
}