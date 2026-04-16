import express from 'express';

const routes = (controller, authMiddleware) => {
  const router = express.Router();

  // Route ini dibatasi (restricted), jadi pakai authMiddleware
  router.post('/', authMiddleware, controller.postThread);

  // tidak butuh auth, untuk umum
  router.get('/:threadId', controller.getThread);

  router.put('/:threadId/comments/:commentId/likes', authMiddleware, controller.putLikeCommentHandler);

  return router;
};

export default routes;