"use client"

import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { PaymentHistory } from "@/lib/types/billing"

interface PaymentHistoryTableProps {
  payments: PaymentHistory[]
}

export function PaymentHistoryTable({ payments }: PaymentHistoryTableProps) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount / 100)
  }

  const getStatusStyle = (status: PaymentHistory["status"]) => {
    switch (status) {
      case "succeeded":
        return "bg-green-50 text-green-700"
      case "failed":
        return "bg-red-50 text-red-700"
      default:
        return "bg-yellow-50 text-yellow-700"
    }
  }

  const getStatusText = (status: PaymentHistory["status"]) => {
    switch (status) {
      case "succeeded":
        return "Confirmado"
      case "failed":
        return "Falhou"
      default:
        return "Pendente"
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Plano</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Valor</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment.id}>
            <TableCell>
              {formatDistanceToNow(new Date(payment.created * 1000), {
                addSuffix: true,
                locale: ptBR,
              })}
            </TableCell>
            <TableCell>{payment.description}</TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusStyle(
                  payment.status
                )}`}
              >
                {getStatusText(payment.status)}
              </span>
            </TableCell>
            <TableCell className="text-right">
              {formatAmount(payment.amount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}