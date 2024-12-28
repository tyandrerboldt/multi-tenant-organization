"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Receipt } from "lucide-react"
import { PaymentHistory, PaymentHistoryFilterParams, SortField, SortOrder } from "@/lib/types/billing"
import { PaymentHistoryTable } from "./payment-history/table"
import { PaymentHistoryPagination } from "./payment-history/pagination"
import { PaymentHistoryFilters } from "./payment-history/filters"

interface PaymentHistoryDialogProps {
  payments: PaymentHistory[]
}

const ITEMS_PER_PAGE = 2

export function PaymentHistoryDialog({ payments }: PaymentHistoryDialogProps) {
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState<PaymentHistoryFilterParams>({
    search: "",
    sortBy: "created",
    sortOrder: "desc",
    page: 1,
  })

  const filteredAndSortedPayments = useMemo(() => {
    let result = [...payments]

    // Aplicar filtro de pesquisa
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (payment) =>
          payment.description.toLowerCase().includes(searchLower) ||
          payment.status.toLowerCase().includes(searchLower)
      )
    }

    // Aplicar ordenação
    result.sort((a, b) => {
      const multiplier = filters.sortOrder === "desc" ? -1 : 1

      switch (filters.sortBy) {
        case "created":
          return (a.created - b.created) * multiplier
        case "amount":
          return (a.amount - b.amount) * multiplier
        case "status":
          return a.status.localeCompare(b.status) * multiplier
        default:
          return 0
      }
    })

    return result
  }, [payments, filters])

  // Paginação
  const totalPages = Math.ceil(filteredAndSortedPayments.length / ITEMS_PER_PAGE)
  const paginatedPayments = filteredAndSortedPayments.slice(
    (filters.page - 1) * ITEMS_PER_PAGE,
    filters.page * ITEMS_PER_PAGE
  )

  const handleSearchChange = (search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }))
  }

  const handleSortChange = (sortBy: SortField, sortOrder: SortOrder) => {
    setFilters((prev) => ({ ...prev, sortBy, sortOrder }))
  }

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Receipt className="mr-2 h-4 w-4" />
          Histórico de Pagamentos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Histórico de Pagamentos</DialogTitle>
          <DialogDescription>
            Histórico completo de pagamentos da sua organização
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <PaymentHistoryFilters
            search={filters.search}
            onSearchChange={handleSearchChange}
            sortBy={filters.sortBy}
            sortOrder={filters.sortOrder}
            onSortChange={handleSortChange}
          />

          <div className="max-h-[60vh] overflow-auto">
            <PaymentHistoryTable payments={paginatedPayments} />
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <PaymentHistoryPagination
                currentPage={filters.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}