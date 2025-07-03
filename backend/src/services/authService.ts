import { supabase } from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function registerUser(username: string ,email: string, password: string) {
  const { data: existingUser, error: selectError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();
  if (selectError && selectError.code !== "PGRST116") {
    throw new Error(`Erro ao verificar usuário existente: ${selectError.message}`);
  }
  if (existingUser) {
    throw new Error("Usuário já existe");
  }
  const { data: existingUsername, error: usernameError } = await supabase
  .from("users")
  .select("id")
  .eq("username", username)
  .single();
if (usernameError && usernameError.code !== "PGRST116") {
  throw new Error(`Erro ao verificar nome de usuário existente: ${usernameError.message}`);
}
if (existingUsername) {
  throw new Error("Este nome de usuário já está em uso.");
}
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const { data, error: insertError } = await supabase
    .from("users")
    .insert([{ username, email, password: hashedPassword }])
    .select(); 
  if (insertError) {
    throw new Error(`Erro ao cadastrar usuário: ${insertError.message}`);
  }
  return data?.[0];
}

export async function loginUser(email: string, rawPassword: string, keepLoggedIn: boolean = false) {
  const { data: user, error: selectError } = await supabase
    .from("users")
    .select("id, username, email, password")
    .eq("email", email)
    .single();
  if (selectError || !user) {
    throw new Error("Usuário não encontrado");
  }
  const isPasswordValid = await bcrypt.compare(rawPassword, user.password);
  if (!isPasswordValid) {
    throw new Error("Senha incorreta");
  }
 const jwtSecret = process.env.JWT_SECRET;
 const jwtExpiration = process.env.JWT_EXPIRATION;
if (!jwtSecret || !jwtExpiration) {
    throw new Error("JWT_SECRET não está definido nas variáveis de ambiente");
  }
  const accessToken = jwt.sign(
    { userId: user.id, email: user.email },
    jwtSecret, 
    { expiresIn: "1h" }
  );
  let refreshToken = null;
  if (keepLoggedIn) {
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    const refreshTokenExpiration = process.env.REFRESH_TOKEN_EXPIRATION;
    if (!refreshTokenSecret || !refreshTokenExpiration) {
        throw new Error("Variáveis de ambiente do Refresh Token não definidas");
    }
    refreshToken = jwt.sign(
      { userId: user.id },
      refreshTokenSecret, 
      { expiresIn: "30d" }
  );
}
  return {
    accessToken,
    refreshToken,
    user: { id: user.id, username: user.username, email: user.email }
  };
}

export async function handleRefreshToken(refreshToken: string) {
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiration = process.env.JWT_EXPIRATION;
  if (!refreshTokenSecret || !jwtSecret || !jwtExpiration) {
    throw new Error("Variáveis de ambiente necessárias não configuradas.");
  }
  try {
    const decoded = jwt.verify(refreshToken, refreshTokenSecret) as { userId: string };
    const { data: user, error } = await supabase
      .from("users")
      .select("id, username, email")
      .eq("id", decoded.userId)
      .single();

    if (error || !user) {
      throw new Error("Usuário associado ao token não existe.");
    }
    const newAccessToken = jwt.sign(
      { userId: user.id, username: user.username, email: user.email },
      jwtSecret,
      { expiresIn: "1h" } 
    );
    return { accessToken: newAccessToken };
  } catch (error) {
    console.error("Erro ao renovar access token:", error);
    throw new Error("Refresh token inválido ou expirado.");
  }
}

export async function getUser(userId: string) {
  const { data: user, error } = await supabase
    .from("users")
    .select("id, username, email")
    .eq("id", userId)
    .single();

  if (error || !user) {
    throw new Error("Usuário não encontrado.");
  }

  return user;
}

  export function verifyToken(token: string) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET não está definido nas variáveis de ambiente");
    }
    try {
      const decoded = jwt.verify(token, jwtSecret) as {
        userId: string;
        email: string;
      };
      return decoded;
    } catch (error) {
      throw new Error("Token inválido ou expirado");
    }
  }
