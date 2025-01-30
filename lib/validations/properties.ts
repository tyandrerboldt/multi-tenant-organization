import { z } from "zod";
import { HighlightStatus, PropertyType, Status } from "../types/properties";

const apartmentFeaturesSchema = z.object({
  rooms: z.string().min(1, "Número de quartos é obrigatório"),
  bathrooms: z.string().min(1, "Número de banheiros é obrigatório"),
  garage_spaces: z.string().min(1, "Número de vagas é obrigatório"),
  size: z.string().min(1, "Área é obrigatória"),
  apartment_type: z.string().min(1, "Tipo do apartamento é obrigatório"),
  apartment_features: z.array(z.string()),
  apartment_complex_features: z.array(z.string()),
});

export const propertySchema = z.object({
  code: z.string().min(2, "Código deve ter pelo menos 2 caracteres"),
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  type: z.nativeEnum(PropertyType),
  status: z.nativeEnum(Status),
  highlight: z.nativeEnum(HighlightStatus),
  categoryId: z.number(),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  ownerId: z.string().min(1, "Proprietário é obrigatório"),
  featuresIds: z.array(z.number()),
  features: z.object({}).optional().or(apartmentFeaturesSchema),
  images: z.array(z.object({
    file: z.instanceof(File).optional(),
    url: z.string(),
    isMain: z.boolean()
  }))
});

export type PropertyFormData = z.infer<typeof propertySchema>;