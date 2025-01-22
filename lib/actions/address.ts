"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AddressData } from "@/lib/types/address";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function createOrUpdatePropertyAddress(
  propertyId: string,
  addressData: AddressData
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  try {
    // Get or create country (Brazil)
    const country = await prisma.country.findFirstOrThrow({
      where: { code: "BR" },
    });

    // Get or create state
    const state = await prisma.state.upsert({
      where: {
        code_country_id: {
          code: addressData.stateCode,
          countryId: country.id,
        },
      },
      create: {
        name: addressData.state,
        code: addressData.stateCode,
        countryId: country.id,
      },
      update: {},
    });

    // Get or create city
    const city = await prisma.city.upsert({
      where: {
        name_stateId: {
          name: addressData.city,
          stateId: state.id,
        },
      },
      create: {
        name: addressData.city,
        stateId: state.id,
      },
      update: {},
    });

    // Get or create neighborhood
    const neighborhood = await prisma.neighborhood.upsert({
      where: {
        name_cityId: {
          name: addressData.neighborhood,
          cityId: city.id,
        },
      },
      create: {
        name: addressData.neighborhood,
        cityId: city.id,
      },
      update: {},
    });

    // Get or create street
    const street = await prisma.street.upsert({
      where: {
        name_cityId: {
          name: addressData.street,
          cityId: city.id,
        },
      },
      create: {
        name: addressData.street,
        cityId: city.id,
      },
      update: {},
    });

    // Get or create address
    const address = await prisma.address.upsert({
      where: {
        streetId_cityId_stateId_countryId: {
          streetId: street.id,
          cityId: city.id,
          stateId: state.id,
          countryId: country.id,
        },
      },
      create: {
        streetId: street.id,
        neighborhoodId: neighborhood.id,
        cityId: city.id,
        stateId: state.id,
        countryId: country.id,
        zipcode: addressData.zipcode,
      },
      update: {},
    });

    // Create or update property address
    await prisma.propertyAddress.upsert({
      where: {
        propertyId: propertyId,
      },
      create: {
        propertyId: propertyId,
        addressId: address.id,
        number: addressData.number,
        complement: addressData.complement,
      },
      update: {
        addressId: address.id,
        number: addressData.number,
        complement: addressData.complement,
      },
    });

    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      include: { organization: true },
    });

    if (property?.organization) {
      revalidatePath(`/app/${property.organization.slug}/properties`);
    }

    return { success: true };
  } catch (error) {
    console.error("Error creating/updating address:", error);
    throw new Error("Falha ao salvar endereço");
  }
}

export async function getPropertyAddress(propertyId: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  const propertyAddress = await prisma.propertyAddress.findUnique({
    where: { propertyId: propertyId },
    include: {
      address: {
        include: {
          street: true,
          neighborhood: true,
          city: true,
          state: true,
          country: true,
        },
      },
    },
  });

  if (!propertyAddress) return null;

  return {
    zipcode: propertyAddress.address.zipcode,
    street: propertyAddress.address.street.name,
    neighborhood: propertyAddress.address.neighborhood.name,
    city: propertyAddress.address.city.name,
    state: propertyAddress.address.state.name,
    stateCode: propertyAddress.address.state.code,
    number: propertyAddress.number,
    complement: propertyAddress.complement,
  };
}