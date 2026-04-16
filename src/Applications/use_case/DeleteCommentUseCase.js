class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, owner } = useCasePayload;

    // 1. Pastikan thread-nya ada
    await this._threadRepository.verifyThreadAvailability(threadId);

    // 2. Pastikan komentarnya ada
    await this._commentRepository.checkCommentAvailability(commentId);

    // 3. Pastikan yang mau hapus adalah yang bikin komentar (Authorization)
    await this._commentRepository.verifyCommentOwner(commentId, owner);

    // 4. Kalau semua aman, eksekusi hapus (soft delete)
    await this._commentRepository.deleteComment(commentId);
  }
}

export default DeleteCommentUseCase;