"use server"

import { prisma } from "@/lib/prisma"
import { OrganizationFormData } from "@/lib/validations/organization"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Role } from "@prisma/client"
import { createStripeCustomer } from "@/lib/stripe"

export async function createOrganization(data: OrganizationFormData) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  const existingOrg = await prisma.organization.findUnique({
    where: { slug: data.slug },
  })

  if (existingOrg) {
    throw new Error("Slug da organização já existe")
  }

  // Criar cliente no Stripe
  const stripeCustomer = await createStripeCustomer(
    session.user.email!,
    data.slug
  )

  const organization = await prisma.organization.create({
    data: {
      name: data.name,
      slug: data.slug,
      stripeCustomerId: stripeCustomer.id,
      memberships: {
        create: {
          userId: session.user.id,
          role: Role.OWNER,
        },
      },
    },
  })

  return { success: true, organization }
}

export async function getUserOrganizations() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  const organizations = await prisma.organization.findMany({
    where: {
      memberships: {
        some: {
          userId: session.user.id
        }
      }
    },
    include: {
      memberships: {
        where: {
          userId: session.user.id
        },
        select: {
          role: true
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return organizations
}