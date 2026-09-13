import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { initDatabase } from './db/database';
import { runSeed } from './seeds/seed';
import { apiLimiter } from './middleware/rateLimiter';

import authRoutes from './routes/auth';
import recipesRoutes from './routes/recipes';
import nutritionRoutes from './routes/nutrition';
import shoppingRoutes from './routes/shopping';
import communityRoutes from './routes/community';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// General API rate limiter
app.use('/api', apiLimiter);

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    app: 'MealCarta Encarta Neo API',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipesRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/shopping', shoppingRoutes);
app.use('/api/community', communityRoutes);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[MealCarta Server Error]', err);
  res.status(500).json({ error: 'Ocurrió un error inesperado en el servidor enciclopédico' });
});

// Initialize DB and launch server
initDatabase();
runSeed();

app.listen(PORT, () => {
  console.log(`🌌 [MealCarta Server] Corriendo en http://localhost:${PORT}`);
});
