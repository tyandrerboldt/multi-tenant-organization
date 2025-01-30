"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OwnerFormData } from "@/lib/validations/owner";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function getOwners(organizationId: string, page = 1, limit = 10) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  const skip = (page - 1) * limit;

  const [owners, total] = await Promise.all([
    prisma.owner.findMany({
      where: { organizationId },
      orderBy: { name: "asc" },
      skip,
      take: limit,
      include: {
        _count: {
          select: { properties: true },
        },
      },
    }),
    prisma.owner.count({
      where: { organizationId },
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
    select: { id: true, name: true, email: true, phone: true }
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
      name: { contains: search, }
    },
    take: 5,
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });

  console.log(owners);
  console.log(owners);
  

  return owners;
}