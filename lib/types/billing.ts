export interface PaymentHistory {
  id: string
  amount: number
  description: string
  status: "succeeded" | "pending" | "failed"
  created: number
}