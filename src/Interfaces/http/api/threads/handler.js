/* istanbul ignore file */
import AddThreadUseCase from '../../../../Applications/use_case/AddThreadUseCase.js';
import GetThreadUseCase from '../../../../Applications/use_case/GetThreadUseCase.js';
import ToggleLikeCommentUseCase from '../../../../Applications/use_case/ToggleLikeCommentUseCase.js';

class ThreadsController {
  constructor(container) {
    this._container = container;

    this.postThread = this.postThread.bind(this);
    this.getThread = this.getThread.bind(this);
    this.putLikeCommentHandler = this.putLikeCommentHandler.bind(this);
  }

  async postThread(req, res) {
    const { id: owner } = req.user;
    const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);

    const addedThread = await addThreadUseCase.execute({
      ...req.body,
      owner,
    });

    res.status(201).json({
      status: 'success',
      data: {
        addedThread,
      },
    });
  }

  async getThread(req, res, next) {
    try {
      const { threadId } = req.params; // Ambil ID dari URL

      const getThreadUseCase = this._container.getInstance(GetThreadUseCase.name);

      const thread = await getThreadUseCase.execute(threadId);

      // Kembalikan response sukses beserta datanya
      res.status(200).json({
        status: 'success',
        data: {
          thread,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async putLikeCommentHandler(req, res, next) {
    try {
      const { threadId, commentId } = req.params;
      
      const { id: userId } = req.user;

      const toggleLikeCommentUseCase = this._container.getInstance(ToggleLikeCommentUseCase.name);
      await toggleLikeCommentUseCase.execute(userId, threadId, commentId);

      return res.status(200).json({
        status: 'success',
      });
    } catch (error) {
      next(error); 
    }
  }
}

export default ThreadsController;