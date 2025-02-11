
export enum PropertyType {
  APARTMENT = "APARTMENT",
  COMMERCIAL = "COMMERCIAL",
  HOUSE = "HOUSE",
  LAND = "LAND",
  ROOM_RENT = "ROOM_RENT",
  SEASON_RENT = "SEASON_RENT",
}

export enum Status {
  DRAFT = "DRAFT",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  UNAVAILABLE = "UNAVAILABLE",
}

export enum HighlightStatus {
  NORMAL = "NORMAL",
  FEATURED = "FEATURED",
  MAIN = "MAIN",
}

export enum PropertySituation {
  NEW = "NEW",
  EXCELLENT = "EXCELLENT",
  GOOD = "GOOD",
  NEEDS_RENOVATION = "NEEDS_RENOVATION",
  LAUNCH = "LAUNCH"
}

export const propertySituationLabels: Record<PropertySituation, string> = {
  [PropertySituation.NEW]: "Novo",
  [PropertySituation.EXCELLENT]: "Excelente",
  [PropertySituation.GOOD]: "Bom",
  [PropertySituation.NEEDS_RENOVATION]: "Precisa de reforma",
  [PropertySituation.LAUNCH]: "Lançamento",
}

export const propertyTypeLabels: Record<PropertyType, string> = {
  [PropertyType.APARTMENT]: "Apartamento",
  [PropertyType.COMMERCIAL]: "Comércio e indústria",
  [PropertyType.HOUSE]: "Casa",
  [PropertyType.LAND]: "Terrenos, sítios e fazendas",
  [PropertyType.ROOM_RENT]: "Aluguel de quartos",
  [PropertyType.SEASON_RENT]: "Temporada",
}

export const statusLabels: Record<Status, string> = {
  [Status.DRAFT]: "Rascunho",
  [Status.ACTIVE]: "Ativo",
  [Status.INACTIVE]: "Inativo",
  [Status.UNAVAILABLE]: "Indisponível",
}

export const highlightStatusLabels: Record<HighlightStatus, string> = {
  [HighlightStatus.NORMAL]: "Normal",
  [HighlightStatus.FEATURED]: "Destaque",
  [HighlightStatus.MAIN]: "Principal",
}
