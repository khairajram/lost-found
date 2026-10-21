import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { ENV } from './config/env.js';
import { prisma } from './config/prisma.js';
import { socketManager } from './sockets/socket.manager.js';
import { errorHandler } from './middleware/errorHandler.js';
import { upload } from './middleware/upload.js';
import { geminiService } from './ai/gemini.service.js';

import authRoutes from './routes/auth.routes.js';
import lostRoutes from './routes/lost.routes.js';
import foundRoutes from './routes/found.routes.js';
import matchRoutes from './routes/match.routes.js';
import chatRoutes from './routes/chat.routes.js';

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
socketManager.initialize(server);

// Security & Logging Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(morgan(ENV.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static file uploads serving
app.use('/uploads', express.static(ENV.UPLOAD_DIR));

// Healthcheck & AI Status
app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const isGeminiAvailable = await geminiService.isAvailable();

    res.json({
      status: 'UP',
      timestamp: new Date().toISOString(),
      database: 'PostgreSQL (Connected)',
      aiEngine: {
        provider: 'Google Gemini',
        model: ENV.GEMINI_MODEL,
        isApiKeyConfigured: isGeminiAvailable,
        mode: isGeminiAvailable ? 'Live Cloud Vision' : 'Intelligent Fallback Heuristic',
      },
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'DOWN',
      error: err.message,
    });
  }
});

// Single & Multi Photo Upload Route
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ success: false, message: 'No image file uploaded' });
    return;
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    data: {
      url: fileUrl,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
    },
  });
});

// Instant Gemini Photo Analysis Endpoint
app.post('/api/ai/analyze-image', async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      res.status(400).json({ success: false, message: 'Image path or data is required' });
      return;
    }
    const analysis = await geminiService.analyzeImage(image);
    res.json({
      success: true,
      data: analysis,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/lost', lostRoutes);
app.use('/api/found', foundRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/chats', chatRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start Server
const PORT = ENV.PORT || 5000;
server.listen(PORT, '0.0.0.0', async () => {
  console.log(`=================================================`);
  console.log(`🚀 Find & Lost API Server running on port ${PORT}`);
  console.log(`📦 Database: PostgreSQL on port 5434 (findlost-postgres)`);
  console.log(`🤖 AI Engine: Google Gemini 1.5 Flash`);
  console.log(`🌐 Healthcheck: http://localhost:${PORT}/api/health`);
  console.log(`=================================================`);
});

export { app, server };
