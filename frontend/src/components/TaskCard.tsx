"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Pencil, Check, X } from "lucide-react";

export default function TaskCard({
  todo,
  isEditing,
  editedTitle,
  editedDescription,
  onSetEditedTitle,
  onSetEditedDescription,
  onStartEditing,
  onCancelEditing,
  onSaveEditing,
  onDelete,
  onUpdateStatus,
}: TaskCardProps) {
  const renderActions = () => {
    switch (todo.status) {
      case "iniciar":
        return (
          <Button onClick={() => onUpdateStatus(todo.id, "em andamento")}>
            Iniciar
          </Button>
        );
      case "em andamento":
        return (
          <>
            <Button onClick={() => onUpdateStatus(todo.id, "concluida")}>
              Concluir
            </Button>
            <Button
              variant="outline"
              onClick={() => onUpdateStatus(todo.id, "iniciar")}
            >
              Cancelar
            </Button>
          </>
        );
      case "concluida":
        return (
          <Select
            onValueChange={(status) =>
              onUpdateStatus(todo.id, status as Todo["status"])
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Reabrir Tarefa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="iniciar">Reabrir (A Fazer)</SelectItem>
              <SelectItem value="em andamento">
                Reabrir (Em Andamento)
              </SelectItem>
            </SelectContent>
          </Select>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="p-5 space-y-4">
      {isEditing ? (
        <div className="space-y-2">
          <Input
            value={editedTitle}
            onChange={(e) => onSetEditedTitle(e.target.value)}
          />
          <Textarea
            value={editedDescription}
            onChange={(e) => onSetEditedDescription(e.target.value)}
          />
        </div>
      ) : (
        <div>
          <h3 className="font-bold break-words">{todo.title}</h3>
          <p className="text-sm text-muted-foreground break-words mt-1">
            {todo.description}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Criado em: {new Date(todo.created_at).toLocaleDateString("pt-BR")}
          </p>
        </div>
      )}
      <div className="flex items-center justify-end gap-2">
        {isEditing ? (
          <>
            <Button size="icon" onClick={onSaveEditing}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline" onClick={onCancelEditing}>
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            {renderActions()}
            <Button
              size="icon"
              variant="outline"
              onClick={() => onStartEditing(todo)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onDelete(todo.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </Card>
  );
}
