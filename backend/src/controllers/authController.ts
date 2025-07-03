import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { AuthRequest } from '../middleware/auth';

export async function register(req: Request, res: Response) {
  try {
      const { username, email, password } = req.body;
      const user = await authService.registerUser(username ,email, password);
      res.status(201).json(user);
  } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : 'Erro ao registrar usuário' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password,  keepLoggedIn } = req.body;
    const user = await authService.loginUser(email, password,  keepLoggedIn);
    res.status(200).json(user);
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({ message: error instanceof Error ? error.message : 'Erro ao fazer login' });
  }
}

export async function refreshToken(req: Request, res: Response) {
  const token = req.body.refreshToken;
  if (!token) {
   res.status(401).json({ message: 'Refresh token não fornecido' });
  }
  try {
    const { accessToken } = await authService.handleRefreshToken(token);
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Erro ao atualizar token:", error);
    res.status(401).json({  message: error instanceof Error ? error.message : 'Refresh token inválido ou expirado' });
  }
}

export async function get(req: AuthRequest, res: Response) {
  try {
    const user = await authService.getUser(req.userId!);
    res.status(200).json({ user }); 
  } catch (error) {
    res.status(404).json({ message: error instanceof Error ? error.message : 'Usuário não encontrado' });
  }
}
