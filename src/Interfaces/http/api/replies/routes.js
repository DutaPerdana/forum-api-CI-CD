import express from 'express';

const routes = (controller, authMiddleware) => {
  const router = express.Router();

  router.post('/:threadId/comments/:commentId/replies', authMiddleware, controller.postReply);
  router.delete('/:threadId/comments/:commentId/replies/:replyId', authMiddleware, controller.deleteReply);

  return router;
};

export default routes;