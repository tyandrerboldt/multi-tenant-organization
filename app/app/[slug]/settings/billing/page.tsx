import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card } from "@/components/ui/card"
import { PlanGrid } from "@/components/billing/plan-grid"
import { PaymentHistoryDialog } from "@/components/billing/payment-history-dialog"
import { getPaymentHistory } from "@/lib/actions/billing"
import { PLANS } from "@/lib/constants/plans"

interface BillingPageProps {
  params: {
    slug: string
  }
}

export default async function BillingPage({ params }: BillingPageProps) {
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

  const payments = await getPaymentHistory(organization.id)
  const currentPlanDetails = PLANS[organization.plan]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Planos e Assinaturas</h1>
          <p className="text-gray-600">
            Gerencie o plano e assinatura da sua organização
          </p>
        </div>
        <PaymentHistoryDialog payments={payments} />
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Plano Atual</h2>
          <div className="mt-2 p-4 bg-primary/5 rounded-lg">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-lg">{currentPlanDetails.name}</p>
                <p className="text-sm text-gray-600">{currentPlanDetails.description}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {currentPlanDetails.price === 0
                    ? "Grátis"
                    : currentPlanDetails.price === null
                    ? "Personalizado"
                    : `R$${(currentPlanDetails.price / 100).toFixed(2)}/mês`}
                </p>
                {organization.stripeSubscriptionId && (
                  <p className="text-sm text-gray-600">Assinatura ativa</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <PlanGrid
          organizationId={organization.id}
          currentPlan={organization.plan}
          stripeCustomerId={organization.stripeCustomerId}
        />
      </Card>
    </div>
  )
}