import { Response } from 'express';
import * as todoService from '../services/toDoService';
import { AuthRequest } from '../middleware/auth'; 

export async function createTodoController(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!;
    const { title, description } = req.body;

    if (!title) {
        res.status(400).json({ message: 'O título é obrigatório.' });
    }
    const newTodo = await todoService.createTodo(userId, title, description);
    res.status(201).json(newTodo);
  } catch (error) {
    console.error("Erro ao criar tarefa:", error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'Erro interno do servidor' });
  }
}

export async function getTodosController(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!;
    const todos = await todoService.getTodosByUserId(userId);
    res.status(200).json(todos);
  } catch (error) {
    console.error("Erro ao buscar tarefas:", error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'Erro interno do servidor' });
  }
}

export async function updateTodoController(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!;
    const { todoId } = req.params;
    const { status } = req.body;
    if (!status || !['iniciar', 'em andamento', 'concluida'].includes(status)) {
      res.status(400).json({ message: 'Status inválido.' });
    }
    const updatedTodo = await todoService.updateTodoStatus(todoId, userId, status);
     res.status(200).json(updatedTodo);
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Erro interno do servidor' 
    });
  }
}

export async function deleteTodoController(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!;
    const { todoId } = req.params;
    const result = await todoService.deleteTodo(todoId, userId);
    res.status(200).json(result);
  } catch (error) {
    console.error("Erro ao deletar tarefa:", error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'Erro interno do servidor' });
  }
}

export async function updateTodoTasksController(req: AuthRequest, res: Response) {
  try {
    const userId = req.userId!;
    const { todoId } = req.params;
    const { title, description } = req.body; 
    await todoService.updateTodoTasks(todoId, userId, title, description);
    res.status(200).json({ message: 'Tarefas atualizadas com sucesso.' });
  } catch (error) {
    console.error("Erro ao atualizar tarefas:", error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'Erro interno do servidor' });
  }
}