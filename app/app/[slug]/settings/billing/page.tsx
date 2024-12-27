import { PaymentHistoryDialog } from "@/components/billing/payment-history-dialog";
import { PlanGrid } from "@/components/billing/plan-grid";
import { Card } from "@/components/ui/card";
import { getPaymentHistory } from "@/lib/actions/billing";
import { authOptions } from "@/lib/auth";
import { PLANS } from "@/lib/constants/plans";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface BillingPageProps {
  params: {
    slug: string;
  };
}

export default async function BillingPage({ params }: BillingPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const organization = await prisma.organization.findFirst({
    where: {
      slug: params.slug,
      memberships: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  if (!organization) {
    redirect("/create-organization");
  }

  const payments = await getPaymentHistory(organization.id);
  const currentPlanDetails = PLANS[organization.plan];

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
        <PlanGrid
          organizationId={organization.id}
          currentPlan={organization.plan}
          stripeCustomerId={organization.stripeCustomerId}
          stripeSubscriptionId={organization.stripeSubscriptionId}
        />
      </Card>
    </div>
  );
}
