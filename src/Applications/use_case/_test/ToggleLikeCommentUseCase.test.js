import { describe, it, expect, vi } from 'vitest';
import ToggleLikeCommentUseCase from '../ToggleLikeCommentUseCase.js';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import LikeRepository from '../../../Domains/likes/LikeRepository.js';

describe('ToggleLikeCommentUseCase', () => {
  it('should orchestrate the add like action correctly if like not exists', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkCommentAvailability = vi.fn()
      .mockImplementation(() => Promise.resolve());
    
    // Skenario: Belum pernah like (return false)
    mockLikeRepository.checkLikeIsExists = vi.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockLikeRepository.addLike = vi.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await toggleLikeCommentUseCase.execute(useCasePayload.userId, useCasePayload.threadId, useCasePayload.commentId);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkCommentAvailability).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.checkLikeIsExists).toHaveBeenCalledWith(useCasePayload.userId, useCasePayload.commentId);
    expect(mockLikeRepository.addLike).toHaveBeenCalledWith(useCasePayload.userId, useCasePayload.commentId);
  });

  it('should orchestrate the delete like action correctly if like already exists', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    /** mocking needed function */
    mockThreadRepository.verifyThreadAvailability = vi.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.checkCommentAvailability = vi.fn()
      .mockImplementation(() => Promise.resolve());
    
    // Skenario: Sudah pernah like (return true)
    mockLikeRepository.checkLikeIsExists = vi.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockLikeRepository.deleteLike = vi.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const toggleLikeCommentUseCase = new ToggleLikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await toggleLikeCommentUseCase.execute(useCasePayload.userId, useCasePayload.threadId, useCasePayload.commentId);

    // Assert
    expect(mockThreadRepository.verifyThreadAvailability).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkCommentAvailability).toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.checkLikeIsExists).toHaveBeenCalledWith(useCasePayload.userId, useCasePayload.commentId);
    expect(mockLikeRepository.deleteLike).toHaveBeenCalledWith(useCasePayload.userId, useCasePayload.commentId);
  });
});