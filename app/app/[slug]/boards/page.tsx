"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getBoards, createBoard } from "@/lib/actions/boards";
import { showToast } from "@/lib/toast";
import { AddBoardDialog } from "./_components/add-board-dialog";

interface Board {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

interface BoardsPageProps {
  params: {
    slug: string;
  };
}

export default function BoardsPage({ params }: BoardsPageProps) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddBoardOpen, setIsAddBoardOpen] = useState(false);

  useEffect(() => {
    const loadBoards = async () => {
      try {
        const data = await getBoards(params.slug);
        setBoards(data);
      } catch (error) {
        showToast(
          error instanceof Error ? error.message : "Falha ao carregar quadros",
          { variant: "error" }
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadBoards();
  }, [params.slug]);

  const handleAddBoard = async (data: { name: string; description?: string }) => {
    try {
      const result = await createBoard(params.slug, data);
      if (result.success) {
        setBoards([...boards, result.board]);
        showToast("Quadro criado com sucesso", { variant: "success" });
      }
    } catch (error) {
      showToast("Falha ao criar quadro", { variant: "error" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quadros</h1>
          <p className="text-gray-600">Gerencie seus quadros Kanban</p>
        </div>
        <Button onClick={() => setIsAddBoardOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Quadro
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards.map((board) => (
          <Link
            key={board.id}
            href={`/app/${params.slug}/boards/${board.id}`}
            className="block"
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-2">{board.name}</h3>
              {board.description && (
                <p className="text-gray-600 text-sm mb-4">{board.description}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Criado em{" "}
                {new Date(board.createdAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </Card>
          </Link>
        ))}

        {boards.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">
              Nenhum quadro encontrado. Crie seu primeiro quadro!
            </p>
          </div>
        )}
      </div>

      <AddBoardDialog
        open={isAddBoardOpen}
        onOpenChange={setIsAddBoardOpen}
        onAddBoard={handleAddBoard}
      />
    </div>
  );
}