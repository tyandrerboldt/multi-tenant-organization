export interface PaymentHistory {
  id: string
  amount: number
  description: string
  status: "succeeded" | "pending" | "failed"
  created: number
}

export type SortField = "created" | "amount" | "status"
export type SortOrder = "asc" | "desc"

export interface PaymentHistoryFilterParams {
  search: string
  sortBy: SortField
  sortOrder: SortOrder
  page: number
}