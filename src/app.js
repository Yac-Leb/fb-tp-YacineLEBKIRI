import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes.js';
import eventRoutes from './routes/event.routes.js';
import groupRoutes from './routes/group.routes.js';
import threadRoutes from './routes/thread.routes.js';




const app = express();

// --- Middlewares de sécurité et de base ---
app.use(helmet());
app.use(cors());
app.use(express.json()); // Pour lire le JSON envoyé par le client
app.use(morgan('dev'));  // Pour afficher les requêtes dans la console

// --- Limite de requêtes (anti spam) ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100,               // max 100 requêtes
});
app.use(limiter);

// --- Routes principales ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/groups', groupRoutes);
app.use('/api/v1/threads', threadRoutes);



// --- Gestion des routes non trouvées ---
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// --- Gestion des erreurs globales ---
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

export default app;
