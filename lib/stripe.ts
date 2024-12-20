import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
  typescript: true,
})

export async function createStripeCustomer(email: string, organizationId: string) {
  return stripe.customers.create({
    email,
    metadata: {
      organizationId,
    },
  })
}

export async function createStripeSubscription(
  customerId: string,
  priceId: string
) {
  return stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: "default_incomplete",
    payment_settings: { save_default_payment_method: "on_subscription" },
    expand: ["latest_invoice.payment_intent"],
  })
}

export async function cancelStripeSubscription(subscriptionId: string) {
  return stripe.subscriptions.cancel(subscriptionId)
}