"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OwnerFormData } from "@/lib/validations/owner";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

interface GetOwnersParams {
  organizationId: string;
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export async function getOwners({
  organizationId,
  page = 1,
  limit = 10,
  search,
  sortBy = "name",
  sortOrder = "asc",
}: GetOwnersParams) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  const skip = (page - 1) * limit;

  // Build where clause
  const where = {
    organizationId,
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search } },
          ],
        }
      : {}),
  };

  // Build order by
  const orderBy: any = {};
  if (sortBy === "properties") {
    orderBy._count = { properties: sortOrder };
  } else {
    orderBy[sortBy] = sortOrder;
  }

  const [owners, total] = await Promise.all([
    prisma.owner.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        _count: {
          select: { properties: true },
        },
      },
    }),
    prisma.owner.count({
      where,
    }),
  ]);

  return {
    owners,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total,
  };
}

export async function getOwner(id: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  return prisma.owner.findUnique({
    where: { id },
    select: { id: true, name: true }
  });
}

export async function createOwner(organizationId: string, data: OwnerFormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  const owner = await prisma.owner.create({
    data: {
      ...data,
      organizationId,
    },
  });

  revalidatePath(`/app/${organizationId}/properties/owners`);
  return { success: true, owner };
}

export async function updateOwner(
  organizationId: string,
  ownerId: string,
  data: OwnerFormData
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  const owner = await prisma.owner.update({
    where: { id: ownerId },
    data,
  });

  revalidatePath(`/app/${organizationId}/properties/owners`);
  return { success: true, owner };
}

export async function deleteOwner(organizationId: string, ownerId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  await prisma.owner.delete({
    where: { id: ownerId },
  });

  revalidatePath(`/app/${organizationId}/properties/owners`);
  return { success: true };
}

export async function searchOwners(organizationId: string, search: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  const owners = await prisma.owner.findMany({
    where: {
      organizationId,
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
      ],
    },
    take: 5,
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });

  return owners;
}