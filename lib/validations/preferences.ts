import * as z from "zod"

export const preferencesSchema = z.object({
  defaultOrganizationId: z.string().optional(),
  theme: z.enum(["light", "dark", "system"]).default("system"),
})

export type PreferencesFormData = z.infer<typeof preferencesSchema>