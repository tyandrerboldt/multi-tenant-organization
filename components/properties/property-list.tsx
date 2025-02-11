"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { deleteProperty } from "@/lib/actions/properties";
import { showToast } from "@/lib/toast";
import {
  PropertyType,
  Status,
  highlightStatusLabels,
  propertyTypeLabels,
  statusLabels,
} from "@/lib/types/properties";
import { Property } from "@prisma/client";
import { ArrowUpDown, Building2, Home, LayoutGrid, Pencil, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { OwnerSelect } from "./owner-select";

interface PropertyListProps {
  properties: (Property & {
    images: { url: string }[];
  })[];
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  organizationId: string;
}

export function PropertyList({
  properties,
  currentPage,
  totalPages,
  baseUrl,
  organizationId,
}: PropertyListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [ownerId, setOwnerId] = useState(searchParams.get("ownerId") || "");
  const [showHighlighted, setShowHighlighted] = useState(
    searchParams.get("highlight") === "FEATURED" ||
      searchParams.get("highlight") === "MAIN"
  );
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const updateFilters = ({
    search,
    status,
    type,
    highlight,
    ownerId,
    sortBy,
    sortOrder,
    page,
  }: {
    search?: string;
    status?: string;
    type?: string;
    highlight?: string;
    ownerId?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
  }) => {
    const params = new URLSearchParams(searchParams);

    if (search !== undefined) params.set("search", search);
    if (status !== undefined) params.set("status", status);
    if (type !== undefined) params.set("type", type);
    if (highlight !== undefined) params.set("highlight", highlight);
    if (ownerId !== undefined) params.set("ownerId", ownerId);
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

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setType("");
    setOwnerId("");
    setShowHighlighted(false);
    router.push(baseUrl);
  };

  const handleDelete = async () => {
    if (!selectedPropertyId) return;

    try {
      setIsDeleting(true);
      await deleteProperty(organizationId, selectedPropertyId);
      showToast("Imóvel removido com sucesso", { variant: "success" });
      router.refresh();
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Falha ao remover imóvel",
        { variant: "error" }
      );
    } finally {
      setIsDeleting(false);
      setSelectedPropertyId(null);
    }
  };

  const getPropertyIcon = (propertyType: PropertyType) => {
    switch (propertyType) {
      case PropertyType.HOUSE:
        return <Home className="h-5 w-5" />;
      case PropertyType.COMMERCIAL:
        return <Building2 className="h-5 w-5" />;
      default:
        return <LayoutGrid className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-4 flex-wrap">
          <Input
            placeholder="Buscar imóveis..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              updateFilters({ search: e.target.value, page: 1 });
            }}
            className="max-w-xs"
          />

          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value);
              updateFilters({ status: value, page: 1 });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              {Object.entries(statusLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={type}
            onValueChange={(value) => {
              setType(value);
              updateFilters({ type: value, page: 1 });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos</SelectItem>
              {Object.entries(propertyTypeLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="w-[350px]">
            <OwnerSelect
              organizationId={organizationId}
              value={ownerId}
              onChange={(value) => {
                setOwnerId(value);
                updateFilters({ ownerId: value, page: 1 });
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Apenas destaques</span>
            <Switch
              checked={showHighlighted}
              onCheckedChange={(checked) => {
                setShowHighlighted(checked);
                updateFilters({
                  highlight: checked ? "FEATURED" : "",
                  page: 1,
                });
              }}
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="whitespace-nowrap"
          >
            <X className="mr-2 h-4 w-4" />
            Limpar filtros
          </Button>
        </div>
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
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("type")}>
                  Tipo
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("status")}>
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("highlight")}>
                  Destaque
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-4">
                    {property.images[0] ? (
                      <img
                        src={property.images[0].url}
                        alt={property.name}
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                        {getPropertyIcon(property.type as PropertyType)}
                      </div>
                    )}
                    <span>{property.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {propertyTypeLabels[property.type as PropertyType]}
                </TableCell>
                <TableCell>{statusLabels[property.status as Status]}</TableCell>
                <TableCell>{highlightStatusLabels[property.highlight]}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`${baseUrl}/${property.code}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPropertyId(property.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {properties.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum imóvel encontrado
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
        open={!!selectedPropertyId}
        onOpenChange={() => setSelectedPropertyId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover imóvel</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este imóvel? Esta ação não pode ser
              desfeita.
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