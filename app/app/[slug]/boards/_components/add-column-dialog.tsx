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
import * as z from "zod";

const columnSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
});

type ColumnFormData = z.infer<typeof columnSchema>;

interface Column {
  id: string;
  name: string;
  order: number;
  boardId: string;
}

interface AddColumnDialogProps {
  open: boolean;
  boardId:string;
  onOpenChange: (open: boolean) => void;
  onAddColumn: (column: Column) => void;
}

export function AddColumnDialog({
  open,
  boardId,
  onOpenChange,
  onAddColumn,
}: AddColumnDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ColumnFormData>({
    resolver: zodResolver(columnSchema),
  });

  const onSubmit = async (data: ColumnFormData) => {
    try {
      setIsSubmitting(true);

      // In a real app, this would be an API call
      const newColumn: Column = {
        id: crypto.randomUUID(),
        name: data.name,
        boardId,
        order: 0,
      };

      onAddColumn(newColumn);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding column:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Coluna</DialogTitle>
          <DialogDescription>
            Adicione uma nova coluna ao seu quadro Kanban
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Coluna</Label>
            <Input
              id="name"
              placeholder="Ex: Em Negociação"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
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