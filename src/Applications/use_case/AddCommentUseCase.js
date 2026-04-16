import NewComment from '../../Domains/comments/entities/NewComment.js';

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    // 1. Validasi Input
    const newComment = new NewComment(useCasePayload);

    // 2. Pastikan Thread-nya beneran ada di database (kalau tidak ada, ini akan throw 404 dari repository)
    await this._threadRepository.verifyThreadAvailability(useCasePayload.threadId);

    // 3. Simpan komentar
    return this._commentRepository.addComment(newComment);
  }
}

export default AddCommentUseCase;