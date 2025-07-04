"use client";

import { useState, useEffect, FormEvent, useCallback } from "react";
import { useAuth } from "@/services/AuthService";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function TasksPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const fetchTodos = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<Todo[]>(`${BASE_URL}/api/todos`);
      setTodos(response.data);
    } catch (err) {
      setError("Falha ao carregar as tarefas. Tente novamente mais tarde.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user, BASE_URL]);
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAddTodo = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("O título da tarefa não pode ser vazio.");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/todos`, {
        title,
        description,
      });
      const newTodo = response.data as Todo;
      setTodos([...todos, newTodo]);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError("Falha ao adicionar a tarefa.");
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id: string, status: Todo["status"]) => {
    try {
      const response = await axios.put(`${BASE_URL}/api/todos/${id}`, {
        status,
      });
      const updatedTodo = response.data as Todo;
      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    } catch (err) {
      setError("Falha ao atualizar a tarefa.");
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      try {
        await axios.delete(`${BASE_URL}/api/todos/${id}`);
        setTodos(todos.filter((todo) => todo.id !== id));
      } catch (err) {
        setError("Falha ao excluir a tarefa.");
        console.error(err);
      }
    }
  };
  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="text-center">
          <p className="text-2xl">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-4 border-b border-gray-700">
          <h1 className="text-4xl font-bold text-center sm:text-left mb-4 sm:mb-0">
            Olá, {user?.username}!
          </h1>
          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-transform duration-200 hover:scale-105"
          >
            Sair
          </button>
        </header>

        {error && (
          <p className="bg-red-500 text-white p-3 rounded-lg mb-6 text-center">
            {error}
          </p>
        )}
        <div className="bg-gray-800 p-6 rounded-xl mb-10 shadow-lg border border-gray-700">
          <h2 className="text-2xl font-semibold mb-5">Adicionar Nova Tarefa</h2>
          <form onSubmit={handleAddTodo} className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da tarefa"
              className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              required
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição (opcional)"
              className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              rows={3}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
            >
              Adicionar Tarefa
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-6">Sua Lista de Tarefas</h2>
          <div className="space-y-4">
            {todos.length > 0 ? (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className="bg-gray-800 p-5 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-gray-700 hover:border-blue-500 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{todo.title}</h3>
                    <p className="text-gray-400 mt-1">
                      {todo.description || "Sem descrição"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto mt-4 sm:mt-0">
                    <div className="relative w-full sm:w-40">
                      <select
                        value={todo.status}
                        onChange={(e) =>
                          handleUpdateStatus(
                            todo.id,
                            e.target.value as Todo["status"]
                          )
                        }
                        className="w-full appearance-none bg-gray-700 border border-gray-600 text-white py-2 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-gray-600 focus:border-gray-500 cursor-pointer"
                      >
                        <option value="iniciar">A Fazer</option>
                        <option value="em andamento">Em Andamento</option>
                        <option value="concluida">Concluída</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                        <svg
                          className="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTodo(todo.id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-transform duration-200 hover:scale-110"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-400 py-10 bg-gray-800 rounded-xl">
                <p className="text-lg">Você ainda não tem tarefas.</p>
                <p>Adicione sua primeira tarefa no formulário acima!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
