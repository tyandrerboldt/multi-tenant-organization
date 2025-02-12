import { z } from "zod";
import { HighlightStatus, PropertySituation, PropertyType, Status } from "../types/properties";

// Base schemas for different property types
const apartmentFeaturesSchema = z.object({
  rooms: z.string().min(1, "Número de quartos é obrigatório"),
  bathrooms: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  garage_spaces: z.string().optional(),
  size: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  apartment_type: z.string().min(1, "Tipo do apartamento é obrigatório"),
  apartment_features: z.array(z.string()),
  apartment_complex_features: z.array(z.string()),
  iptu: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  condominio: z.preprocess((val) => Number(val), z.number().min(0).optional()),
});

const houseFeaturesSchema = z.object({
  rooms: z.string().min(1, "Número de quartos é obrigatório"),
  bathrooms: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  garage_spaces: z.string().optional(),
  size: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  home_type: z.string().min(1, "Tipo da casa é obrigatório"),
  home_features: z.array(z.string()),
  home_complex_features: z.array(z.string()),
  iptu: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  condominio: z.preprocess((val) => Number(val), z.number().min(0).optional()),
});

const landFeaturesSchema = z.object({
  size: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  re_land_type: z.string().min(1, "Tipo do terreno é obrigatório"),
  re_land_features: z.array(z.string()),
  iptu: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  condominio: z.preprocess((val) => Number(val), z.number().min(0).optional()),
});

const commercialFeaturesSchema = z.object({
  size: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  commercial_type: z.string().optional(),
  commercial_features: z.array(z.string()),
  iptu: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  condominio: z.preprocess((val) => Number(val), z.number().min(0).optional()),
});

const seasonRentFeaturesSchema = z.object({
  rooms: z.string().min(1, "Número de quartos é obrigatório"),
  bathrooms: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  garage_spaces: z.string().optional(),
  beds: z.string().min(1, "Número de camas é obrigatório"),
  size: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  rent_type: z.string().optional(),
  season_type: z.string().min(1, "Tipo de temporada é obrigatório"),
  season_features: z.array(z.string()),
});

const roomRentFeaturesSchema = z.object({
  room_rent_features: z.array(z.string()),
});

// Main property schema
export const propertySchema = z.object({
  code: z.string().min(2, "Código deve ter pelo menos 2 caracteres"),
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  type: z.nativeEnum(PropertyType),
  status: z.nativeEnum(Status),
  highlight: z.nativeEnum(HighlightStatus),
  situation: z.nativeEnum(PropertySituation),
  categoryId: z.number().default(1),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  ownerId: z.string().min(1, "Proprietário é obrigatório"),
  capturerId: z.string().optional().nullable(),
  enableRent: z.boolean(),
  enableSale: z.boolean(),
  rentalValue: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  saleValue: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  features: z.discriminatedUnion("type", [
    z.object({ type: z.literal(PropertyType.APARTMENT), data: apartmentFeaturesSchema }),
    z.object({ type: z.literal(PropertyType.HOUSE), data: houseFeaturesSchema }),
    z.object({ type: z.literal(PropertyType.LAND), data: landFeaturesSchema }),
    z.object({ type: z.literal(PropertyType.COMMERCIAL), data: commercialFeaturesSchema }),
    z.object({ type: z.literal(PropertyType.SEASON_RENT), data: seasonRentFeaturesSchema }),
    z.object({ type: z.literal(PropertyType.ROOM_RENT), data: roomRentFeaturesSchema }),
  ]).optional(),
  images: z.array(z.object({
    file: z.instanceof(File).optional(),
    url: z.string(),
    isMain: z.boolean()
  })).optional(),
});

export type PropertyFormData = z.infer<typeof propertySchema>;