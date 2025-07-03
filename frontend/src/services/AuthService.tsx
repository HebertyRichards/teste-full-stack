"use client";

import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const AUTH_TOKEN_KEY = "auth_token";
  const REFRESH_TOKEN_KEY = "refresh_token";

  const logout = useCallback(() => {
    setUser(null);
    Cookies.remove(AUTH_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
    delete axios.defaults.headers.common.Authorization;
    router.push("/login");
  }, [router]);

  useEffect(() => {
    const verifyUserSession = async () => {
      setLoading(true);
      const authToken = Cookies.get(AUTH_TOKEN_KEY);
      const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);

      let tokenToUse = authToken;

      if (!authToken && refreshToken) {
        console.log("Token de acesso não encontrado");
        try {
          const { data } = await axios.post<RefreshTokenResponse>(
            `${BASE_URL}/auth/refresh-token`,
            { refreshToken }
          );
          const { accessToken: newAccessToken } = data;
          Cookies.set(AUTH_TOKEN_KEY, newAccessToken, { expires: 1 });
          tokenToUse = newAccessToken;
          console.log("Sessão renovada com sucesso.");
        } catch (error) {
          console.error("Falha ao renovar sessão, deslogando.", error);
          logout();
          setLoading(false);
          return;
        }
      }

      if (tokenToUse) {
        try {
          axios.defaults.headers.common.Authorization = `Bearer ${tokenToUse}`;
          const { data } = await axios.get<{ user: User }>(
            `${BASE_URL}/auth/user`
          );

          if (data.user) {
            setUser(data.user);
          } else {
            logout();
          }
        } catch (error) {
          console.error(
            error instanceof Error ? error.message : "Erro desconhecido"
          );
          logout();
        }
      }

      setLoading(false);
    };

    verifyUserSession();
  }, [BASE_URL, logout]);

  const login = async (
    email: string,
    password: string,
    keepLoggedIn: boolean = false
  ) => {
    console.log("[Auth] Tentando login:", email);
    try {
      const { data } = await axios.post<LoginResponse>(
        `${BASE_URL}/auth/login`,
        { email, password, keepLoggedIn }
      );
      const { accessToken, refreshToken, user } = data;
      setUser(user);

      Cookies.set(AUTH_TOKEN_KEY, accessToken, { expires: 1 / 1440 });
      if (refreshToken) {
        Cookies.set(REFRESH_TOKEN_KEY, refreshToken, { expires: 30 });
      }
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      router.push("/");
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Falha no login. Verifique suas credenciais.");
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        username,
        email,
        password,
      });
      router.push("/login");
      console.log("Registro com sucesso");
    } catch (error) {
      console.error("Erro no registro", error);
      alert("Falha no registro. O email pode já estar em uso.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2>Carregando...</h2>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve estar dentro de um AuthProvider");
  return context;
};
