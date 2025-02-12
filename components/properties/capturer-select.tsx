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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { searchCapturers } from "@/lib/actions/team";

interface Capturer {
  id: string;
  user: {
    name: string;
    email: string;
    image: string | null;
  };
}

interface CapturerSelectProps {
  organizationId: string;
  value?: string;
  onChange: (value: string) => void;
}

export function CapturerSelect({ organizationId, value, onChange }: CapturerSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [capturers, setCapturers] = useState<Capturer[]>([]);
  const [selectedCapturer, setSelectedCapturer] = useState<Capturer>();
  const [loading, setLoading] = useState(false);

  // Load initial capturer data when value is provided
  useEffect(() => {
    const loadCapturer = async () => {
      if (value) {
        try {
          const capturer = await searchCapturers(organizationId, "", value);
          if (capturer.length > 0) {
            setSelectedCapturer(capturer[0]);
          }
        } catch (error) {
          console.error("Error loading capturer:", error);
        }
      } else {
        setSelectedCapturer(undefined);
      }
    };

    loadCapturer();
  }, [value, organizationId]);

  const handleSearch = async (searchTerm: string) => {
    setSearch(searchTerm);
    try {
      setLoading(true);
      if (searchTerm.length >= 2) {
        const results = await searchCapturers(organizationId, searchTerm);
        setCapturers(results);
      } else {
        setCapturers([]);
      }
    } catch (error) {
      console.error("Error searching capturers:", error);
      setCapturers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (capturer: Capturer) => {
    setSelectedCapturer(capturer);
    onChange(capturer.id);
    setOpen(false);
    setSearch("");
    setCapturers([]);
  };

  const handleClear = () => {
    setSelectedCapturer(undefined);
    onChange("");
  };

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <Input
          value={selectedCapturer?.user.name || ""}
          placeholder="Selecione um captador"
          readOnly
          className="pr-24"
        />
        {selectedCapturer && (
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
      <Button type="button" variant="outline" onClick={() => setOpen(true)}>
        <Search className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Selecionar Captador</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Buscar captadores..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        Buscando...
                      </TableCell>
                    </TableRow>
                  ) : capturers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="h-24 text-center">
                        {search.length < 2
                          ? "Digite pelo menos 2 caracteres para buscar"
                          : "Nenhum captador encontrado"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    capturers.map((capturer) => (
                      <TableRow key={capturer.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={capturer.user.image || undefined} />
                              <AvatarFallback>
                                {capturer.user.name?.[0] || capturer.user.email?.[0] || "?"}
                              </AvatarFallback>
                            </Avatar>
                            {capturer.user.name}
                          </div>
                        </TableCell>
                        <TableCell>{capturer.user.email}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            onClick={() => handleSelect(capturer)}
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