import CommentsController from './handler.js';
import routes from './routes.js';

const comments = (container, authMiddleware) => {
  const controller = new CommentsController(container);
  return routes(controller, authMiddleware);
};

export default comments;