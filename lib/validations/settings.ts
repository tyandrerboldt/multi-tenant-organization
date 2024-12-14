import * as z from "zod"

export const organizationSettingsSchema = z.object({
  name: z.string().min(2, { message: "Organization name must be at least 2 characters" }),
  slug: z.string()
    .min(3, { message: "Slug must be at least 3 characters" })
    .regex(/^[a-z0-9-]+$/, { message: "Slug can only contain lowercase letters, numbers, and dashes" }),
})

export const deleteOrganizationSchema = z.object({
  organizationName: z.string(),
})

export type OrganizationSettingsFormData = z.infer<typeof organizationSettingsSchema>
export type DeleteOrganizationFormData = z.infer<typeof deleteOrganizationSchema>