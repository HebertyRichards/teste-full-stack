import { supabase } from "../config/db";

export async function createTodo(userId: string, title: string, description: string) {
    const { data, error } = await supabase
      .from('todos')
      .insert({ user_id: userId, title, description })
      .select()
      .single();
  
    if (error) {
      console.error("Erro ao criar tarefa:", error);
      throw new Error('Não foi possível criar a tarefa.');
    }
    return data;
  }
  
  export async function getTodosByUserId(userId: string) {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  
    if (error) {
      console.error("Erro ao buscar tarefas:", error);
      throw new Error('Não foi possível buscar as tarefas.');
    }
    return data || [];
  }

    export async function updateTodoStatus(todoId: string, userId: string, status: 'iniciar' | 'em andamento' | 'concluida') {
      const { data, error } = await supabase
        .from('todos')
        .update({ status })
        .eq('id', todoId)
        .eq('user_id', userId)
        .select()
        .single();
    
      if (error) {
        console.error("Erro ao atualizar tarefa:", error);
        throw new Error('Não foi possível atualizar a tarefa. Verifique se a tarefa pertence a você.');
      }
      return data;
    }
  
  export async function deleteTodo(todoId: string, userId: string) {
    const { error, count } = await supabase
      .from('todos')
      .delete({ count: 'exact' })
      .eq('id', todoId)
      .eq('user_id', userId);
  
    if (error || count === 0) {
      console.error("Erro ao deletar tarefa:", error);
      throw new Error('Não foi possível deletar a tarefa. Verifique se a tarefa existe e pertence a você.');
    }
    
    return { message: 'Tarefa deletada com sucesso.' };
  }

export async function updateTodoTasks(todoId: string, userId: string, title: string, description?: string) {
    const { data, error } = await supabase
      .from('todos')
      .update({ title, description })
      .eq('id', todoId)
      .eq('user_id', userId)
      .select()
      .single();

      if (error) {
        console.error("Erro ao atualizar tarefa:", error);
        throw new Error('Não foi possível atualizar a tarefa. Verifique se a tarefa pertence a você.');
      }
      return data;
}