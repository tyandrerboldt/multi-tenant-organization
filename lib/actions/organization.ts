"use server"

import { prisma } from "@/lib/prisma"
import { OrganizationFormData } from "@/lib/validations/organization"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Role } from "@prisma/client"

export async function createOrganization(data: OrganizationFormData) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const existingOrg = await prisma.organization.findUnique({
    where: { slug: data.slug },
  })

  if (existingOrg) {
    throw new Error("Organization slug already exists")
  }

  const organization = await prisma.organization.create({
    data: {
      name: data.name,
      slug: data.slug,
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
    throw new Error("Unauthorized")
  }

  const memberships = await prisma.membership.findMany({
    where: { userId: session.user.id },
    include: {
      organization: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return memberships.map(m => m.organization)
}