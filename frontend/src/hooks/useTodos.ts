"use client"

import { useState, useEffect, useCallback } from "react";
import { todoService } from "@/services/TodoService";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await todoService.getAll();
      setTodos(data);
    } catch (error) {
      setError("Falha ao carregar as tarefas.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async (data: { title: string; description?: string }) => {
    try {
      const newTodo = await todoService.create(data);
      setTodos((prev) => [...prev, newTodo]);
    } catch (error) {
      setError("Falha ao adicionar a tarefa.");
      console.error(error);
    }
  };

  const updateStatus = async (id: string, status: Todo['status']) => {
    const originalTodos = [...todos];
    setTodos(todos.map((t) => (t.id === id ? { ...t, status } : t)));

    try {
      await todoService.updateStatus(id, status);
    } catch (error) {
      setError("Falha ao atualizar a tarefa.");
      setTodos(originalTodos);
      console.error(error);
    }
  };

  const updateTodoContent = async (id: string, data: { title: string; description: string }) => {
    const originalTodos = [...todos];
    setTodos((prevTodos) =>
      prevTodos.map((todo) => (todo.id === id ? { ...todo, ...data } : todo))
    );
    try {
      await todoService.updateContent(id, data);
    } catch (error) {
      setError("Falha ao salvar as alterações.");
      setTodos(originalTodos);
      console.error(error);
    }
  };

  const deleteTodo = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    const originalTodos = [...todos];
    setTodos(todos.filter((t) => t.id !== id));

    try {
      await todoService.remove(id);
    } catch (error) {
      setError("Falha ao excluir a tarefa.");
      setTodos(originalTodos);
      console.error(error);
    }
  };

  return {
    todos,
    isLoading,
    error,
    addTodo,
    updateStatus,
    deleteTodo,
    updateTodoContent,
  };
}