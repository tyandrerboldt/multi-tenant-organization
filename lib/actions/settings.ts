"use server"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { OrganizationSettingsFormData } from "@/lib/validations/settings"
import { Role } from "@prisma/client"
import { getServerSession } from "next-auth"
import { revalidatePath } from "next/cache"

export async function updateOrganizationSettings(
  organizationId: string,
  data: OrganizationSettingsFormData
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  // Verificar se o usuário tem permissão para atualizar as configurações
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
    throw new Error("Você não tem permissão para atualizar as configurações da organização")
  }

  // Verificar se o slug já está sendo usado por outra organização
  const existingOrg = await prisma.organization.findFirst({
    where: {
      slug: data.slug,
      id: { not: organizationId },
    },
  })

  if (existingOrg) {
    throw new Error("Slug da organização já existe")
  }

  const organization = await prisma.organization.update({
    where: { id: organizationId },
    data: {
      name: data.name,
      slug: data.slug,
    },
  })

  revalidatePath(`/app/${data.slug}`)
  return { success: true, organization }
}

export async function deleteOrganization(organizationId: string) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  // Verificar se o usuário é o proprietário
  const membership = await prisma.membership.findFirst({
    where: {
      organizationId,
      userId: session.user.id,
      role: Role.OWNER,
    },
  })

  if (!membership) {
    throw new Error("Somente o proprietário da organização pode deletar a organização")
  }

  await prisma.organization.delete({
    where: { id: organizationId },
  })

  revalidatePath("/app")
  return { success: true }
}