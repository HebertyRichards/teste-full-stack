import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import toDoRoutes from './routes/toDoRoutes';
import { corsMiddleware } from './middleware/cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(corsMiddleware);
app.use(express.json());


app.use('/auth', authRoutes);
app.use('/api',toDoRoutes);


app.use((_req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});