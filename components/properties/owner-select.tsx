"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOwner, searchOwners } from "@/lib/actions/owners";

interface Owner {
  id: string;
  name: string;
}

interface OwnerSelectProps {
  organizationId: string;
  value?: string;
  onChange: (value: string) => void;
}

export function OwnerSelect({ organizationId, value, onChange }: OwnerSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [owners, setOwners] = useState<Owner[]>([]);
  const [selectedOwner, setSelectedOwner] = useState<Owner>();
  const [loading, setLoading] = useState(false);

  // Load initial owner data when value is provided
  useEffect(() => {
    const loadOwner = async () => {
      if (value) {
        try {
          const owner = await getOwner(value);
          if (owner) {
            setSelectedOwner(owner);
          }
        } catch (error) {
          console.error("Error loading owner:", error);
        }
      } else {
        // Clear selected owner when value is empty/null
        setSelectedOwner(undefined);
      }
    };

    loadOwner();
  }, [value]);

  const handleSearch = async (searchTerm: string) => {
    setSearch(searchTerm);
    try {
      setLoading(true);
      if (searchTerm.length >= 2) {
        const results = await searchOwners(organizationId, searchTerm);
        setOwners(results);
      } else {
        setOwners([]);
      }
    } catch (error) {
      console.error("Error searching owners:", error);
      setOwners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (owner: Owner) => {
    setSelectedOwner(owner);
    onChange(owner.id); // Trigger form change
    setOpen(false);
    setSearch("");
    setOwners([]);
  };

  const handleClear = () => {
    setSelectedOwner(undefined);
    onChange(""); // Trigger form change with empty value
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Input
          value={selectedOwner?.name || ""}
          placeholder="Selecione um proprietário"
          readOnly
          className="pr-24" // Space for clear button
        />
        {selectedOwner && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 -translate-y-1/2"
            onClick={handleClear}
          >
            Limpar
          </Button>
        )}
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Selecionar Proprietário</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Buscar proprietários..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={2} className="h-24 text-center">
                        Buscando...
                      </TableCell>
                    </TableRow>
                  ) : owners.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} className="h-24 text-center">
                        {search.length < 2 
                          ? "Digite pelo menos 2 caracteres para buscar"
                          : "Nenhum proprietário encontrado"
                        }
                      </TableCell>
                    </TableRow>
                  ) : (
                    owners.map((owner) => (
                      <TableRow key={owner.id}>
                        <TableCell>{owner.name}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            onClick={() => handleSelect(owner)}
                          >
                            Selecionar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}