interface User {
  id: string;
  username: string; 
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, keepLoggedIn: boolean) => Promise<void>; 
  register: (username= string, email: string, password: string) => Promise<void>; 
  logout: () => void;
}

interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

interface RefreshTokenResponse {
  accessToken: string;
}

interface Todo {
  id: string;
  title: string;
  description: string;
  status: "iniciar" | "em andamento" | "concluida";
  created_at: string;
}

type TodoStatus = "pending" | "in-progress" | "completed";