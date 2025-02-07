"use server";

import { authOptions } from "@/lib/auth";
import { BUCKET_NAME, deleteImage, s3Client } from "@/lib/minio";
import { prisma } from "@/lib/prisma";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { PropertyFormData } from "../validations/properties";

export async function createProperty(
  organizationId: string,
  data: Omit<PropertyFormData, "images">
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
  });

  if (!organization) {
    throw new Error("Organização não encontrada");
  }

  const slug = slugify(data.name, { lower: true, strict: true });

  const property = await prisma.property.create({
    data: {
      name: data.name,
      code: data.code,
      slug,
      type: data.type,
      status: data.status,
      highlight: data.highlight,
      categoryId: data.categoryId,
      description: data.description,
      ownerId: data.ownerId,
      organizationId,
    },
  });

  revalidatePath(`/app/${organization.slug}/properties`);
  return { success: true, property };
}

export async function updatePropertyGeneral(
  organizationId: string,
  propertyId: string,
  data: Partial<PropertyFormData>
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  const property = await prisma.property.findFirst({
    where: {
      id: propertyId,
      organizationId,
    },
  });

  if (!property) {
    throw new Error("Imóvel não encontrado");
  }

  const slug = slugify(data.name || property.name, {
    lower: true,
    strict: true,
  });

  if (data.code) {
    const codeExists = await issetCode(data.code, organizationId, propertyId);
    if (codeExists) {
      throw new Error("Esse código já está em uso");
    }
  }

  const updatedProperty = await prisma.property.update({
    where: { id: propertyId },
    data: {
      name: data.name,
      code: data.code,
      slug,
      type: data.type,
      status: data.status,
      highlight: data.highlight,
      categoryId: data.categoryId,
      description: data.description,
      ownerId: data.ownerId,
    },
  });

  const organization = await prisma.organization.findUnique({
    where: { id: organizationId },
  });

  revalidatePath(`/app/${organization?.slug}/properties`);
  return { success: true, property: updatedProperty };
}

export async function upsertPropertyFeatures(
  propertyId: string,
  features: any
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  const updatedFeature = await prisma.propertyFeature.upsert({
    where: { propertyId },
    create: {
      ...features,
      propertyId
    },
    update: features,
  });

  return { success: true, property: updatedFeature };
}

async function uploadImage(
  file: File,
  organizationId: string,
  propertyId: string
): Promise<string> {
  try {
    const buffer = await file.arrayBuffer();
    const key = `${organizationId}/${propertyId}/${randomUUID()}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: Buffer.from(buffer),
        ContentType: file.type,
      })
    );

    return `${process.env.MINIO_ENDPOINT}/${BUCKET_NAME}/${key}`;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Falha ao fazer upload da imagem");
  }
}

export async function uploadPropertyImages(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      throw new Error("Não autorizado");
    }

    const organizationId = formData.get("organizationId") as string;
    const propertyId = formData.get("propertyId") as string;
    const imageData = formData.getAll("images[]");
    const mainImageIndex = parseInt(formData.get("mainImageIndex") as string);

    if (!organizationId || !propertyId) {
      throw new Error("Dados inválidos");
    }

    const organization = await prisma.organization.findFirst({
      where: {
        id: organizationId,
        Property: {
          some: {
            id: propertyId,
          },
        },
      },
    });

    if (!organization) {
      throw new Error("Imóvel não encontrado");
    }

    // Get existing images before deleting them
    const existingImages = await prisma.propertyImage.findMany({
      where: { propertyId },
    });

    // Delete existing images from MinIO
    await Promise.all(
      existingImages.map(async (image) => {
        await deleteImage(image.url);
      })
    );

    // Delete existing images from database
    await prisma.propertyImage.deleteMany({
      where: { propertyId },
    });

    // Upload new images
    const imagePromises = imageData.map(async (image, index) => {
      if (image instanceof File) {
        const url = await uploadImage(image, organizationId, propertyId);
        return prisma.propertyImage.create({
          data: {
            url,
            isMain: index === mainImageIndex,
            propertyId,
          },
        });
      } else {
        // Keep existing image URL
        return prisma.propertyImage.create({
          data: {
            url: image as string,
            isMain: index === mainImageIndex,
            propertyId,
          },
        });
      }
    });

    await Promise.all(imagePromises);

    revalidatePath(`/app/${organization.slug}/properties`);
    return { success: true };
  } catch (error) {
    console.error("Error in uploadPropertyImages:", error);
    throw error;
  }
}

export async function getProperties({
  organizationId,
  page = 1,
  limit = 10,
  search,
  status,
  type,
  highlight,
  sortBy = "createdAt",
  sortOrder = "desc",
}: GetPropertiesParams) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  const where = {
    organizationId,
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { code: { contains: search } },
          ],
        }
      : {}),
    ...(status ? { status } : {}),
    ...(type ? { type } : {}),
    ...(highlight ? { highlight } : {}),
  };

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      include: {
        images: {
          where: { isMain: true },
          take: 1,
        },
        PropertyAddress: true,
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.property.count({ where }),
  ]);

  return {
    properties,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total,
  };
}

export async function getProperty(
  organizationId: string,
  propertyCode: string
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  const property = await prisma.property.findFirst({
    where: {
      code: propertyCode,
      organizationId,
    },
  });

  if (!property) {
    throw new Error("Imóvel não encontrado");
  }

  return property;
}

export async function issetCode(
  code: string,
  organizationId: string,
  currentPropertyId: string
) {
  if (!code || code.length < 6) return;

  try {
    const existingProperty = await prisma.property.findFirst({
      where: {
        code,
        organizationId,
        id: { not: currentPropertyId }, // Exclude current property when editing
      },
    });

    return existingProperty;
  } catch (error) {
    console.error("Error validating code:", error);
  }
}

export async function getFeaturesFromPropertyId(propertyId: string) {
  try {
    const features = await prisma.propertyFeature.findUnique({
      where: {
        propertyId,
      },
    });
    return features;
  } catch (error) {
    console.error("Error validating code:", error);
  }
}
