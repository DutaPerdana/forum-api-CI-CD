import ThreadsController from './handler.js';
import routes from './routes.js';

const threads = (container, authMiddleware) => {
  const controller = new ThreadsController(container);
  return routes(controller, authMiddleware);
};

export default threads;