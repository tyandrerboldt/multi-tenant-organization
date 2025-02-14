"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { getOrganizationFromSlug } from "./organization";

interface Column {
  id: string;
  name: string;
  order: number;
  boardId: string;
}

interface Card {
  id: string;
  name: string;
  description?: string;
  notes?: string;
  columnId: string;
  propertyId?: string;
}

// export async function getKanbanData(organizationSlug: string) {
//   const session = await getServerSession(authOptions);

//   const organization = await getOrganizationFromSlug(organizationSlug)
//   const organizationId = organization?.id

//   if (!session?.user?.id) {
//     throw new Error("Não autorizado");
//   }

//   if (!organizationSlug) {
//     throw new Error("Não autorizado");
//   }

//   const [columns, cards] = await Promise.all([
//     prisma.kanbanColumn.findMany({
//       where: { organizationId },
//       orderBy: { order: "asc" },
//     }),
//     prisma.card.findMany({
//       where: { organizationId },
//       orderBy: { order: "asc" },
//     }),
//   ]);

//   return { columns, cards };
// }

export async function createColumn(organizationSlug: string, data: Omit<Column, "id">) {
  const session = await getServerSession(authOptions);

  const organization = await getOrganizationFromSlug(organizationSlug)
  const organizationId = organization?.id

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  if (!organizationId) {
    throw new Error("Não autorizado");
  }


  const lastColumn = await prisma.kanbanColumn.findFirst({
    where: { organizationId },
    orderBy: { order: "desc" },
  });

  const column = await prisma.kanbanColumn.create({
    data: {
      name: data.name,
      order: lastColumn ? lastColumn.order + 1 : 0,
      organizationId,
      boardId: data.boardId
    },
  });

  revalidatePath(`/app/${organizationSlug}/boards`);
  return { success: true, column };
}

export async function updateColumnOrder(
  organizationId: string,
  columns: { id: string; order: number }[]
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  await Promise.all(
    columns.map((column) =>
      prisma.kanbanColumn.update({
        where: { id: column.id },
        data: { order: column.order },
      })
    )
  );

  revalidatePath(`/app/${organizationId}/boards`);
  return { success: true };
}

export async function deleteColumn(organizationId: string, columnId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  await prisma.kanbanColumn.delete({
    where: { id: columnId },
  });

  revalidatePath(`/app/${organizationId}/boards`);
  return { success: true };
}

export async function createCard(organizationSlug: string, data: Omit<Card, "id">) {
  const session = await getServerSession(authOptions);

  const organization = await getOrganizationFromSlug(organizationSlug)
  const organizationId = organization?.id

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  if (!organizationId) {
    throw new Error("Não autorizado");
  }

  const lastCard = await prisma.card.findFirst({
    where: { columnId: data.columnId },
    orderBy: { order: "desc" },
  });

  console.log("Card data");
  console.log(data);
  

  const card = await prisma.card.create({
    data: {
      name: data.name,
      description: data.description,
      notes: data.notes,
      order: lastCard ? lastCard.order + 1 : 0,
      columnId: data.columnId,
      organizationId,
      propertyId: data.propertyId,
    },
  });

  revalidatePath(`/app/${organizationSlug}/boards`);
  return { success: true, card };
}

export async function updateCardOrder(
  organizationId: string,
  cards: { id: string; order: number; columnId: string }[]
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  await Promise.all(
    cards.map((card) =>
      prisma.card.update({
        where: { id: card.id },
        data: {
          order: card.order,
          columnId: card.columnId,
        },
      })
    )
  );

  revalidatePath(`/app/${organizationId}/boards`);
  return { success: true };
}

export async function deleteCard(organizationId: string, cardId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  await prisma.card.delete({
    where: { id: cardId },
  });

  revalidatePath(`/app/${organizationId}/boards`);
  return { success: true };
}