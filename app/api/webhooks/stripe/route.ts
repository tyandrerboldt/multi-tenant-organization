import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { prisma } from "@/lib/prisma"
import { Plan } from "@prisma/client"

const PRICE_TO_PLAN: Record<string, Plan> = {
  [process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID!]: "STARTER",
  [process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!]: "PRO",
  [process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID!]: "ENTERPRISE",
}

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string)
        const priceId = subscription.items.data[0].price.id
        const plan = PRICE_TO_PLAN[priceId]

        if (!plan) {
          console.error("Unknown price ID:", priceId)
          break
        }

        await prisma.organization.update({
          where: { id: session.metadata.organizationId },
          data: {
            stripeSubscriptionId: session.subscription as string,
            plan,
          },
        })
        break
      }

      case "customer.subscription.deleted":
      case "customer.subscription.updated": {
        const subscription = event.data.object

        if (event.type === "customer.subscription.deleted") {
          await prisma.organization.update({
            where: { stripeSubscriptionId: subscription.id },
            data: {
              plan: "FREE",
              stripeSubscriptionId: null,
            },
          })
        } else {
          const priceId = subscription.items.data[0].price.id
          const plan = PRICE_TO_PLAN[priceId]

          if (!plan) {
            console.error("Unknown price ID:", priceId)
            break
          }

          await prisma.organization.update({
            where: { stripeSubscriptionId: subscription.id },
            data: { plan },
          })
        }
        break
      }
    }

    return new NextResponse(null, { status: 200 })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return new NextResponse("Webhook handler failed", { status: 500 })
  }
}