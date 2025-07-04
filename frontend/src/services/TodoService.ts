import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const API_ENDPOINT = `${BASE_URL}/api/todos`;

export const todoService = {
  getAll: async (): Promise<Todo[]> => {
    const response = await axios.get<Todo[]>(API_ENDPOINT);
    return response.data;
  },

  create: async (data: { title: string; description?: string }): Promise<Todo> => {
    const response = await axios.post<Todo>(API_ENDPOINT, data);
    return response.data;
  },

  updateStatus: async (id: string, status: Todo['status']): Promise<Todo> => {
    const response = await axios.put<Todo>(`${API_ENDPOINT}/${id}`, { status });
    return response.data;
  },

  updateContent: async (id: string, data: { title?: string; description?: string }): Promise<Todo> => {
    const response = await axios.put<Todo>(`${API_ENDPOINT}/${id}/tasks`, data);
    return response.data;
  },

  remove: async (id: string): Promise<void> => {
    await axios.delete(`${API_ENDPOINT}/${id}`);
  },
};