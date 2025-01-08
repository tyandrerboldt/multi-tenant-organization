"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { Role, Plan } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { PaymentHistory } from "../types/billing"
import { stripe, cancelStripeSubscription } from "@/lib/stripe"

export async function updateSubscription(
  organizationId: string,
  plan: Plan
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  // Verificar se o usuário é OWNER
  const membership = await prisma.membership.findFirst({
    where: {
      organizationId,
      userId: session.user.id,
      role: Role.OWNER,
    },
  })

  if (!membership) {
    throw new Error("Somente proprietários da organização podem alterar a assinatura")
  }

  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
  })

  if (!organization) {
    throw new Error("Organização não encontrada")
  }

  // Se estiver fazendo downgrade para FREE, cancelar assinatura do Stripe
  if (plan === "FREE" && organization.stripeSubscriptionId) {
    await cancelStripeSubscription(organization.stripeSubscriptionId)
  }

  await prisma.organization.update({
    where: { id: organizationId },
    data: { plan },
  })

  revalidatePath(`/app/${organizationId}/settings/billing`)
  return { success: true }
}


export async function getPaymentHistory(organizationId: string): Promise<PaymentHistory[]> {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
  })

  if (!organization?.stripeCustomerId) {
    return []
  }

  const payments = await stripe.charges.list({
    customer: organization.stripeCustomerId,
    limit: 100,
  })

  return payments.data.map(payment => ({
    id: payment.id,
    amount: payment.amount,
    description: payment.description || "Assinatura",
    status: payment.status as "succeeded" | "pending" | "failed",
    created: payment.created,
  }))
}


export interface OrganizationBillingData {
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  plan: Plan
}

export async function getOrganizationBillingData(
  organizationId: string
): Promise<OrganizationBillingData> {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: {
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      plan: true,
    },
  })

  if (!organization) {
    throw new Error("Organização não encontrada")
  }

  return organization
}