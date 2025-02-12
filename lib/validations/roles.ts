import * as z from "zod"

export const roleSchema = z.object({
  name: z.string().min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
  permissions: z.array(z.object({
    resource: z.enum(["domains", "team", "settings", "property"] as const),
    actions: z.array(z.enum(["capture", "read", "create", "update", "delete"] as const))
  }))
})

export type RoleFormData = z.infer<typeof roleSchema>