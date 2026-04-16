/* istanbul ignore file */
import AddCommentUseCase from '../../../../Applications/use_case/AddCommentUseCase.js';
import DeleteCommentUseCase from '../../../../Applications/use_case/DeleteCommentUseCase.js';

class CommentsController {
  constructor(container) {
    this._container = container;

    this.postComment = this.postComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  async postComment(req, res, next) {
    try {
      const { id: owner } = req.user;
      const { threadId } = req.params;

      const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);

      const addedComment = await addCommentUseCase.execute({
        ...req.body,
        threadId,
        owner,
      });

      res.status(201).json({
        status: 'success',
        data: {
          addedComment,
        },
      });
    } catch (error) {
      next(error); 
    }
  }

  async deleteComment(req, res, next) {
    try {
      const { id: owner } = req.user; // Dari token
      const { threadId, commentId } = req.params; // Dari URL

      const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);

      await deleteCommentUseCase.execute({
        threadId,
        commentId,
        owner,
      });

      // Kalau sukses, kembalikan status 200 OK dengan status 'success'
      res.status(200).json({
        status: 'success',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default CommentsController;