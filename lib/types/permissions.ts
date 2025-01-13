export type Action = "read" | "create" | "update" | "delete"
export type Resource = "domains" | "team" | "settings"

export interface Permission {
  id: string
  roleId?: string | null
  userId?: string | null
  resource: Resource
  actions: Action[]
  createdAt: Date
  updatedAt: Date
}

export interface Role {
  id: string
  name: string
  organizationId: string
  permissions: Permission[]
  createdAt: Date
  updatedAt: Date
}