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
  highlightStatusLabels,
  propertyTypeLabels,
  statusLabels,
} from "@/lib/types/properties";
import { Property } from "@prisma/client";
import { ArrowUpDown, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Card } from "../ui/card";

interface PropertyListProps {
  properties: (Property & {
    images: { url: string }[];
  })[];
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}

export function PropertyList({
  properties,
  currentPage,
  totalPages,
  baseUrl,
}: PropertyListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [type, setType] = useState(searchParams.get("type") || "");
  const [showHighlighted, setShowHighlighted] = useState(
    searchParams.get("highlight") === "FEATURED" ||
      searchParams.get("highlight") === "MAIN"
  );

  const updateFilters = ({
    search,
    status,
    type,
    highlight,
    sortBy,
    sortOrder,
    page,
  }: {
    search?: string;
    status?: string;
    type?: string;
    highlight?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    page?: number;
  }) => {
    const params = new URLSearchParams(searchParams);

    if (search !== undefined) params.set("search", search);
    if (status !== undefined) params.set("status", status);
    if (type !== undefined) params.set("type", type);
    if (highlight !== undefined) params.set("highlight", highlight);
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

  return (
    <div className="space-y-4">
      <Card className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between p-4">
        <div className="flex flex-1 gap-4">
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
        </div>

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
      </Card>

      <Card className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-0">
                <Button variant="ghost" onClick={() => handleSort("name")}>
                  Nome
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="px-0">
                <Button variant="ghost" onClick={() => handleSort("type")}>
                  Tipo
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="px-0">
                <Button variant="ghost" onClick={() => handleSort("status")}>
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="px-0">
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
                    {property.images[0] && (
                      <Image
                        width={80}
                        height={40}
                        src={property.images[0].url}
                        alt={property.name}
                        className="rounded-md object-cover"
                      />
                    )}
                    <span>{property.name}</span>
                  </div>
                </TableCell>
                <TableCell>{propertyTypeLabels[property.type]}</TableCell>
                <TableCell>{statusLabels[property.status]}</TableCell>
                <TableCell>
                  {highlightStatusLabels[property.highlight]}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`${baseUrl}/${property.code}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
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
      </Card>

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
    </div>
  );
}
