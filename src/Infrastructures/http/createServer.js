import express from 'express';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import ClientError from '../../Commons/exceptions/ClientError.js';
import DomainErrorTranslator from '../../Commons/exceptions/DomainErrorTranslator.js';
import users from '../../Interfaces/http/api/users/index.js';
import authentications from '../../Interfaces/http/api/authentications/index.js';
// thread
import threads from '../../Interfaces/http/api/threads/index.js';
import authMiddleware from './middleware/auth.js';
// comment
import comments from '../../Interfaces/http/api/comments/index.js';
// replies
import replies from '../../Interfaces/http/api/replies/index.js';

// file update

const createServer = async (container) => {
  const swaggerDocument = JSON.parse(
    fs.readFileSync(path.resolve(process.cwd(), 'docs/swagger.json'), 'utf8')
  );
  const app = express();

  // Middleware for parsing JSON
  app.use(express.json());

  app.set('trust proxy', 1);
  const threadsLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 menit
    max: 90, // maksimal 90 request per 1 menit
    message: {
      status: 'fail',
      message: 'Terlalu banyak permintaan, silakan coba lagi nanti.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/threads', threadsLimiter);

  // Register routes
  app.use('/users', users(container));
  app.use('/authentications', authentications(container));

  app.use('/threads', threads(container, authMiddleware));
  // otomatis nyambung jadi /threads/:threadId/comments
  app.use('/threads', threads(container, authMiddleware));
  app.use('/threads', comments(container, authMiddleware));

  app.use('/threads', replies(container, authMiddleware));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Global error handler
  app.use((error, req, res, next) => {
    const translatedError = DomainErrorTranslator.translate(error);

    // penanganan client error secara internal.
    if (translatedError instanceof ClientError) {
      return res.status(translatedError.statusCode).json({
        status: 'fail',
        message: translatedError.message,
      });
    }

    // penanganan server error sesuai kebutuhan
    return res.status(500).json({
      status: 'error',
      message: 'terjadi kegagalan pada server kami',
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      status: 'fail',
      message: 'Route not found',
    });
  });

  return app;
};

export default createServer;
