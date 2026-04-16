import express from 'express';

const routes = (controller, authMiddleware) => {
  const router = express.Router();

  router.post('/:threadId/comments', authMiddleware, controller.postComment);
  router.delete('/:threadId/comments/:commentId', authMiddleware, controller.deleteComment);

  return router;
};

export default routes;