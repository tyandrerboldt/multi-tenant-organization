"use server"

import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { authOptions } from "@/lib/auth"
import { AccountFormData } from "@/lib/validations/account"
import { revalidatePath } from "next/cache"

export async function updateAccount(data: AccountFormData) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Não autorizado")
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email: data.email,
      id: { not: session.user.id },
    },
  })

  if (existingUser) {
    throw new Error("Email já está em uso")
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name,
      email: data.email,
      image: data.image || null,
    },
  })

  // Força a revalidação de todas as rotas que usam a sessão
  revalidatePath("/")
  revalidatePath("/account")
  revalidatePath("/app")

  return { success: true, user }
}