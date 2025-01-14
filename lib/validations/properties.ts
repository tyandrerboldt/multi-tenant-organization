import { z } from "zod"
import { HighlightStatus, PropertyType, Status } from "../types/properties"



export const propertySchema = z.object({
  code: z.string().min(2, "Código deve ter pelo menos 2 caracteres"),
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  type: z.nativeEnum(PropertyType),
  status: z.nativeEnum(Status),
  highlight: z.nativeEnum(HighlightStatus),
  categoryId: z.number(),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  featuresIds: z.array(z.number()),
  images: z.array(z.object({
    file: z.instanceof(File).optional(),
    url: z.string(),
    isMain: z.boolean()
  }))
})


export type PropertyFormData = z.infer<typeof propertySchema>