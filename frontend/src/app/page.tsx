"use client";

import { FormEvent, useState, useEffect } from "react";
import { useAuth } from "@/services/AuthService";
import { useTodos } from "@/hooks/useTodos";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Trash2, Pencil, Check, X } from "lucide-react";

export default function TasksPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const {
    todos,
    isLoading,
    error,
    addTodo,
    updateStatus,
    deleteTodo,
    updateTodoContent,
  } = useTodos();

  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleAddSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await addTodo({ title: newTitle, description: newDescription });
    setNewTitle("");
    setNewDescription("");
  };

  const handleStartEditing = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditedTitle(todo.title);
    setEditedDescription(todo.description);
  };

  const handleCancelEditing = () => {
    setEditingTodoId(null);
    setEditedTitle("");
    setEditedDescription("");
  };

  const handleSaveEditing = async () => {
    if (!editingTodoId || !editedTitle.trim()) return;
    await updateTodoContent(editingTodoId, {
      title: editedTitle,
      description: editedDescription,
    });
    handleCancelEditing();
  };
  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-2xl">Carregando...</p>
      </div>
    );
  }

  const renderTaskActions = (todo: Todo) => {
    switch (todo.status) {
      case "iniciar":
        return (
          <>
            <Button onClick={() => updateStatus(todo.id, "em andamento")}>
              Iniciar
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteTodo(todo.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        );
      case "em andamento":
        return (
          <>
            <Button onClick={() => updateStatus(todo.id, "concluida")}>
              Concluir
            </Button>
            <Button
              variant="outline"
              onClick={() => updateStatus(todo.id, "iniciar")}
            >
              Cancelar
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteTodo(todo.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        );
      case "concluida":
        return (
          <>
            <Select
              onValueChange={(status) =>
                updateStatus(todo.id, status as Todo["status"])
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
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteTodo(todo.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <Header user={user} logout={logout} />
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Ocorreu um Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card className="mb-10">
          <CardHeader>
            <CardTitle>Adicionar Nova Tarefa</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Título da tarefa"
                required
              />
              <Textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Descrição"
              />
              <Button type="submit" className="w-full">
                Adicionar Tarefa
              </Button>
            </form>
          </CardContent>
        </Card>
        <div>
          <h2 className="text-3xl font-bold mb-6">Sua Lista de Tarefas</h2>
          <div className="space-y-4">
            {todos.length > 0 ? (
              todos.map((todo) => (
                <Card key={todo.id} className="p-5 space-y-4">
                  {editingTodoId === todo.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                      />
                      <Textarea
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-xl font-bold">{todo.title}</h3>
                      <p className="text-muted-foreground mt-1">
                        {todo.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Criado em:{" "}
                        {new Date(todo.created_at).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2">
                    {editingTodoId === todo.id ? (
                      <>
                        <Button size="icon" onClick={handleSaveEditing}>
                          <Check className="h-4 w-4" />{" "}
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={handleCancelEditing}
                        >
                          <X className="h-4 w-4" />{" "}
                        </Button>
                      </>
                    ) : (
                      <>
                        {renderTaskActions(todo)}
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleStartEditing(todo)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <Card className="text-center text-muted-foreground p-10">
                <p className="text-lg">Você não tem nenhuma tarefa criada</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
