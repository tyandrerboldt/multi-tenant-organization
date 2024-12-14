"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { Role } from "@prisma/client"
import { OrganizationSettingsFormData } from "@/lib/validations/settings"
import { revalidatePath } from "next/cache"

export async function updateOrganizationSettings(
  organizationId: string,
  data: OrganizationSettingsFormData
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  // Check if user has permission to update settings
  const membership = await prisma.membership.findFirst({
    where: {
      organizationId,
      userId: session.user.id,
      role: {
        in: [Role.OWNER, Role.ADMIN],
      },
    },
  })

  if (!membership) {
    throw new Error("You don't have permission to update organization settings")
  }

  // Check if slug is already taken by another organization
  const existingOrg = await prisma.organization.findFirst({
    where: {
      slug: data.slug,
      id: { not: organizationId },
    },
  })

  if (existingOrg) {
    throw new Error("Organization slug already exists")
  }

  const organization = await prisma.organization.update({
    where: { id: organizationId },
    data: {
      name: data.name,
      slug: data.slug,
    },
  })

  revalidatePath(`/dashboard/${data.slug}`)
  return { success: true, organization }
}

export async function deleteOrganization(organizationId: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  // Check if user is the owner
  const membership = await prisma.membership.findFirst({
    where: {
      organizationId,
      userId: session.user.id,
      role: Role.OWNER,
    },
  })

  if (!membership) {
    throw new Error("Only the organization owner can delete the organization")
  }

  await prisma.organization.delete({
    where: { id: organizationId },
  })

  revalidatePath("/dashboard")
  return { success: true }
}