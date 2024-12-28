import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Card } from "@/components/ui/card"
import { AccountForm } from "@/components/user/account-form"

export default async function AccountPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="container max-w-2xl py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Conta</h1>
        <p className="text-gray-600">
          Gerencie suas informações pessoais
        </p>
      </div>

      <Card className="p-6">
        <AccountForm user={session.user} />
      </Card>
    </div>
  )
}