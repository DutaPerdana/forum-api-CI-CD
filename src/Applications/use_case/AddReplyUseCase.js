import NewReply from '../../Domains/replies/entities/NewReply.js';

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId } = useCasePayload;

    // Pastikan payload valid sesuai entitas
    const newReply = new NewReply(useCasePayload);

    // Pastikan thread dan comment tersedia di database
    await this._threadRepository.verifyThreadAvailability(threadId);
    await this._commentRepository.checkCommentAvailability(commentId);

    // Simpan ke database
    return this._replyRepository.addReply(newReply);
  }
}

export default AddReplyUseCase;