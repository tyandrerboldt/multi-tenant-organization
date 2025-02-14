"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";

const cardSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  notes: z.string().optional(),
  columnId: z.string().min(1, "Coluna é obrigatória"),
});

type CardFormData = z.infer<typeof cardSchema>;

interface Column {
  id: string;
  name: string;
  order: number;
}

interface Card {
  id: string;
  name: string;
  description?: string;
  notes?: string;
  order: number;
  columnId: string;
}

interface AddCardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  columns: Column[];
  onAddCard: (card: Card) => void;
}

export function AddCardDialog({
  open,
  onOpenChange,
  columns,
  onAddCard,
}: AddCardDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
  });

  const onSubmit = async (data: CardFormData) => {
    try {
      setIsSubmitting(true);

      // In a real app, this would be an API call
      const newCard: Card = {
        id: crypto.randomUUID(),
        name: data.name,
        description: data.description,
        notes: data.notes,
        order: 0,
        columnId: data.columnId,
      };

      onAddCard(newCard);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding card:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Card</DialogTitle>
          <DialogDescription>
            Adicione um novo card ao seu quadro Kanban
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              placeholder="Nome do card"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="columnId">Coluna *</Label>
            <Select
              onValueChange={(value) => setValue("columnId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma coluna" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((column) => (
                  <SelectItem key={column.id} value={column.id}>
                    {column.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.columnId && (
              <p className="text-sm text-destructive">
                {errors.columnId.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Adicione descrição sobre o card"
              {...register("description")}
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              placeholder="Adicione observações sobre o card"
              {...register("notes")}
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adicionando..." : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}