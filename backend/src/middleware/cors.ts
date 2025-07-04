import cors from 'cors';

export const corsMiddleware = cors({
  origin: [
    'http://localhost:3000', 'https://teste-full-stack-blond.vercel.app'    ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
});
