"use client"

import { useState } from "react"
import { Domain } from "@prisma/client"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { deleteDomain } from "@/lib/actions/domain"
import { DomainPagination } from "./domain-pagination"

interface DomainListProps {
  domains: Domain[]
  organizationId: string
  currentPage: number
  totalPages: number
  canUpdate: boolean
  canDelete: boolean
}

export function DomainList({
  domains,
  organizationId,
  currentPage,
  totalPages,
  canUpdate,
  canDelete,
}: DomainListProps) {
  const router = useRouter()
  const [deletingDomain, setDeletingDomain] = useState<Domain | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deletingDomain) return

    try {
      setIsDeleting(true)
      await deleteDomain(organizationId, deletingDomain.id)
      router.refresh()
    } catch (error) {
      console.error("Falha ao remover domínio:", error)
    } finally {
      setIsDeleting(false)
      setDeletingDomain(null)
    }
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Domínio</TableHead>
            <TableHead>Adicionado em</TableHead>
            {(canUpdate || canDelete) && <TableHead>Ações</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {domains.map((domain) => (
            <TableRow key={domain.id}>
              <TableCell className="font-medium">{domain.name}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(domain.createdAt), { addSuffix: true })}
              </TableCell>
              {(canUpdate || canDelete) && (
                <TableCell>
                  {canDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeletingDomain(domain)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DomainPagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
      />

      <AlertDialog
        open={!!deletingDomain}
        onOpenChange={() => setDeletingDomain(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover domínio</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o domínio {deletingDomain?.name}? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "Removendo..." : "Remover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}