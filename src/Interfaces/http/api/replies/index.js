import RepliesController from './handler.js';
import routes from './routes.js';

const replies = (container, authMiddleware) => {
  const controller = new RepliesController(container);
  return routes(controller, authMiddleware);
};

export default replies;