"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { PreferencesFormData } from "@/lib/validations/preferences"
import { revalidatePath } from "next/cache"

export async function getUserPreferences() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  const preferences = await prisma.userPreferences.findUnique({
    where: { userId: session.user.id },
  })

  return preferences
}

export async function updatePreferences(data: PreferencesFormData) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  const preferences = await prisma.userPreferences.upsert({
    where: { userId: session.user.id },
    update: data,
    create: {
      userId: session.user.id,
      ...data,
    },
  })

  revalidatePath("/app/preferences")
  return { success: true, preferences }
}