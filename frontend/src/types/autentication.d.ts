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
  status: TodoStatus;
  created_at: string;
}

type TodoStatus = "iniciar" | "em andamento" | "concluida";

interface TodoPayload {
  title?: string;
  description?: string;
  status?: TodoStatus;
}

interface Props {
  onAdd: (todoData: TodoPayload) => Promise<void>;
}

interface HeaderProps {
  user: User | null;
  logout: () => void;
}

interface TaskCardProps {
  todo: Todo;
  isEditing: boolean;
  editedTitle: string;
  editedDescription: string;
  onSetEditedTitle: (value: string) => void;
  onSetEditedDescription: (value: string) => void;
  onStartEditing: (todo: Todo) => void;
  onCancelEditing: () => void;
  onSaveEditing: () => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: Todo["status"]) => void;
}
