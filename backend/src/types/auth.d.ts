interface User {
  id: number;
  username: string;
  email: string;
}

interface Todo {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: 'iniciar' | 'em andamento' | 'concluida';
  created_at: string;
}
