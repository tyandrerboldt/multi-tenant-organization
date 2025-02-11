import * as z from "zod";

export const seasonRentFeaturesSchema = z.object({
  seasonType: z.string({
    required_error: "Tipo de temporada é obrigatório",
  }),
  rentType: z.string().optional(),
  rooms: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  beds: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  bathrooms: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  garageSpaces: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  size: z.preprocess((val) => Number(val), z.number().min(0).optional()),
  seasonFeatures: z.array(z.string()).default([]),
});

export type SeasonRentFeaturesFormData = z.infer<typeof seasonRentFeaturesSchema>;