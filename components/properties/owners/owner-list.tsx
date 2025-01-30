"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deleteOwner } from "@/lib/actions/owners";
import { showToast } from "@/lib/toast";

interface Owner {
  id: string;
  name: string;
  email: string;
  phone: string;
  _count: {
    properties: number;
  };
}

interface OwnerListProps {
  owners: Owner[];
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function OwnerList({
  owners,
  currentPage,
  totalPages,
  baseUrl,
}: OwnerListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const updateFilters = ({
    search,
    sortBy,
    sortOrder,
    page,
  }: {
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
  }) => {
    const params = new URLSearchParams(searchParams);

    if (search !== undefined) params.set("search", search);
    if (sortBy !== undefined) params.set("sortBy", sortBy);
    if (sortOrder !== undefined) params.set("sortOrder", sortOrder);
    if (page !== undefined) params.set("page", page.toString());

    router.push(`${baseUrl}?${params.toString()}`);
  };

  const handleSort = (field: string) => {
    const currentSortBy = searchParams.get("sortBy");
    const currentSortOrder = searchParams.get("sortOrder");

    const newSortOrder =
      currentSortBy === field && currentSortOrder === "asc" ? "desc" : "asc";

    updateFilters({ sortBy: field, sortOrder: newSortOrder });
  };

  const handleDelete = async () => {
    if (!selectedOwnerId) return;

    try {
      setIsDeleting(true);
      const organizationId = baseUrl.split("/")[2];
      await deleteOwner(organizationId, selectedOwnerId);
      showToast("Proprietário removido com sucesso", { variant: "success" });
    } catch (error) {
      showToast("Erro ao remover proprietário", { variant: "error" });
    } finally {
      setIsDeleting(false);
      setSelectedOwnerId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Input
          placeholder="Buscar proprietários..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            updateFilters({ search: e.target.value, page: 1 });
          }}
          className="max-w-xs"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("name")}>
                  Nome
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Total de Imóveis</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {owners.map((owner) => (
              <TableRow key={owner.id}>
                <TableCell className="font-medium">{owner.name}</TableCell>
                <TableCell>{owner.email}</TableCell>
                <TableCell>{owner.phone}</TableCell>
                <TableCell>{owner._count.properties}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`${baseUrl}/${owner.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedOwnerId(owner.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {owners.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum proprietário encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilters({ page })}
            >
              {page}
            </Button>
          ))}
        </div>
      )}

      <AlertDialog
        open={!!selectedOwnerId}
        onOpenChange={() => setSelectedOwnerId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover proprietário</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este proprietário? Esta ação não pode
              ser desfeita.
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
  );
}