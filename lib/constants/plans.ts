import { Plan } from "@prisma/client"

export interface PlanFeature {
  name: string
  included: boolean
  limit?: number
}

export interface PlanDetails {
  name: string
  description: string
  price: number | null // em centavos
  features: PlanFeature[]
  stripePriceId: string | null
}

export const PLANS: Record<Plan, PlanDetails> = {
  FREE: {
    name: "Free",
    description: "Para pequenos projetos",
    price: 0,
    stripePriceId: null,
    features: [
      { name: "Até 3 membros", included: true, limit: 3 },
      { name: "1 domínio", included: true, limit: 1 },
      { name: "Suporte por email", included: true },
      { name: "Recursos básicos", included: true },
    ],
  },
  STARTER: {
    name: "Starter",
    description: "Para times em crescimento",
    price: 2900, // R$29/mês
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || "",
    features: [
      { name: "Até 10 membros", included: true, limit: 10 },
      { name: "3 domínios", included: true, limit: 3 },
      { name: "Suporte prioritário", included: true },
      { name: "Recursos avançados", included: true },
    ],
  },
  PRO: {
    name: "Pro",
    description: "Para empresas estabelecidas",
    price: 7900, // R$79/mês
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || "",
    features: [
      { name: "Até 25 membros", included: true, limit: 25 },
      { name: "10 domínios", included: true, limit: 10 },
      { name: "Suporte 24/7", included: true },
      { name: "Recursos premium", included: true },
    ],
  },
  ENTERPRISE: {
    name: "Enterprise",
    description: "Para grandes organizações",
    price: null, // Preço customizado
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID || "",
    features: [
      { name: "Membros ilimitados", included: true },
      { name: "Domínios ilimitados", included: true },
      { name: "Suporte dedicado", included: true },
      { name: "Recursos personalizados", included: true },
    ],
  },
}