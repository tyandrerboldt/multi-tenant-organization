export const ROLE_TRANSLATIONS = {
  OWNER: "Proprietário",
  ADMIN: "Administrador",
  EDITOR: "Editor",
  MEMBER: "Membro",
} as const

export const EDITABLE_ROLES = ["ADMIN", "EDITOR", "MEMBER"] as const