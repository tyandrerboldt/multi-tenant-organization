"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { getOrganizationFromSlug } from "./organization";

export async function getBoards(organizationSlug: string) {
  const session = await getServerSession(authOptions);

  const organization = await getOrganizationFromSlug(organizationSlug);
  const organizationId = organization?.id;

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  if (!organizationId) {
    throw new Error("Não autorizado");
  }

  const boards = await prisma.kanbanBoard.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
  });

  return boards;
}

export async function getBoard(organizationSlug: string, boardId: string) {
  const session = await getServerSession(authOptions);

  const organization = await getOrganizationFromSlug(organizationSlug);
  const organizationId = organization?.id;

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  if (!organizationId) {
    throw new Error("Não autorizado");
  }

  const board = await prisma.kanbanBoard.findFirst({
    where: {
      id: boardId,
      organizationId,
    },
    include: {
      columns: {
        include: {
          cards: true
        }
      }
    }
  });

  if (!board) {
    throw new Error("Quadro não encontrado");
  }

  return board;
}

export async function createBoard(
  organizationSlug: string,
  data: { name: string; description?: string }
) {
  const session = await getServerSession(authOptions);

  const organization = await getOrganizationFromSlug(organizationSlug);
  const organizationId = organization?.id;

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  if (!organizationId) {
    throw new Error("Não autorizado");
  }

  const board = await prisma.kanbanBoard.create({
    data: {
      ...data,
      organizationId,
    },
  });

  revalidatePath(`/app/${organizationId}/boards`);
  return { success: true, board };
}

export async function updateBoard(
  organizationId: string,
  boardId: string,
  data: { name: string; description?: string }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  const board = await prisma.kanbanBoard.update({
    where: { id: boardId },
    data,
  });

  revalidatePath(`/app/${organizationId}/boards/${boardId}`);
  return { success: true, board };
}

export async function deleteBoard(organizationId: string, boardId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  await prisma.kanbanBoard.delete({
    where: { id: boardId },
  });

  revalidatePath(`/app/${organizationId}/boards`);
  return { success: true };
}
