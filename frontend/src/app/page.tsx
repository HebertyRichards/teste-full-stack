"use client";

import { FormEvent, useState, useEffect } from "react";
import { useAuth } from "@/services/AuthService";
import { useTodos } from "@/hooks/useTodos";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import TaskCard from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

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

  const toStartTasks = todos.filter((t) => t.status === "iniciar");
  const inProgressTasks = todos.filter((t) => t.status === "em andamento");
  const completedTasks = todos.filter((t) => t.status === "concluida");

  const cardHandlers = {
    onStartEditing: handleStartEditing,
    onCancelEditing: handleCancelEditing,
    onSaveEditing: handleSaveEditing,
    onDelete: deleteTodo,
    onUpdateStatus: updateStatus,
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {" "}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-center pb-2 border-b-2">
              A Fazer
            </h3>
            {toStartTasks.length > 0 ? (
              toStartTasks.map((todo) => (
                <TaskCard
                  key={todo.id}
                  todo={todo}
                  isEditing={editingTodoId === todo.id}
                  editedTitle={editedTitle}
                  editedDescription={editedDescription}
                  onSetEditedTitle={setEditedTitle}
                  onSetEditedDescription={setEditedDescription}
                  {...cardHandlers}
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground mt-4">
                Nenhuma tarefa aqui.
              </p>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-center pb-2 border-b-2">
              Em Andamento
            </h3>
            {inProgressTasks.length > 0 ? (
              inProgressTasks.map((todo) => (
                <TaskCard
                  key={todo.id}
                  todo={todo}
                  isEditing={editingTodoId === todo.id}
                  editedTitle={editedTitle}
                  editedDescription={editedDescription}
                  onSetEditedTitle={setEditedTitle}
                  onSetEditedDescription={setEditedDescription}
                  {...cardHandlers}
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground mt-4">
                Nenhuma tarefa aqui.
              </p>
            )}
          </div>
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-center pb-2 border-b-2">
              Concluídas
            </h3>
            {completedTasks.length > 0 ? (
              completedTasks.map((todo) => (
                <TaskCard
                  key={todo.id}
                  todo={todo}
                  isEditing={editingTodoId === todo.id}
                  editedTitle={editedTitle}
                  editedDescription={editedDescription}
                  onSetEditedTitle={setEditedTitle}
                  onSetEditedDescription={setEditedDescription}
                  {...cardHandlers}
                />
              ))
            ) : (
              <p className="text-center text-muted-foreground mt-4">
                Nenhuma tarefa aqui.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
