"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SortField, SortOrder } from "@/lib/types/billing"

interface PaymentHistoryFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  sortBy: SortField
  sortOrder: SortOrder
  onSortChange: (field: SortField, order: SortOrder) => void
}

export function PaymentHistoryFilters({
  search,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
}: PaymentHistoryFiltersProps) {
  const sortOptions = [
    { value: "created_desc", label: "Data (mais recente)" },
    { value: "created_asc", label: "Data (mais antiga)" },
    { value: "amount_desc", label: "Valor (maior)" },
    { value: "amount_asc", label: "Valor (menor)" },
    { value: "status_asc", label: "Status (A-Z)" },
    { value: "status_desc", label: "Status (Z-A)" },
  ]

  const handleSortChange = (value: string) => {
    const [field, order] = value.split("_") as [SortField, SortOrder]
    onSortChange(field, order)
  }

  return (
    <div className="flex gap-4 mb-4">
      <div className="flex-1">
        <Input
          placeholder="Pesquisar pagamentos..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Select
        value={`${sortBy}_${sortOrder}`}
        onValueChange={handleSortChange}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}