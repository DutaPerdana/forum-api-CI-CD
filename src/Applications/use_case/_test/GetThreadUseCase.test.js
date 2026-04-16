import { describe, it, expect, vi } from 'vitest';
import ThreadRepository from '../../../Domains/threads/ThreadRepository.js';
import CommentRepository from '../../../Domains/comments/CommentRepository.js';
import GetThreadUseCase from '../GetThreadUseCase.js';
import ReplyRepository from '../../../Domains/replies/ReplyRepository.js';


describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const expectedThread = {
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: '2023-01-01T00:00:00.000Z',
      username: 'dicoding',
    };

    const expectedComments = [
      {
        id: 'comment-1',
        username: 'johndoe',
        date: '2023-01-01T01:00:00.000Z',
        content: 'komentar pertama',
        is_delete: false, // Komentar normal
        likeCount: 2,
      },
      {
        id: 'comment-2',
        username: 'dicoding',
        date: '2023-01-01T02:00:00.000Z',
        content: 'komentar rahasia',
        is_delete: true, 
        likeCount: 0,
      },
    ];

    const expectedReplies = [
      { id: 'reply-1', comment_id: 'comment-1', content: 'balasan aman', date: '2023-01-01T02:00:00.000Z', username: 'dicoding', is_delete: false },
      { id: 'reply-2', comment_id: 'comment-1', content: 'balasan rahasia', date: '2023-01-01T03:00:00.000Z', username: 'johndoe', is_delete: true },
    ];


    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // Mocking
    mockThreadRepository.getThreadById = vi.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThreadId = vi.fn()
      .mockImplementation(() => Promise.resolve(expectedComments));
    mockReplyRepository.getRepliesByThreadId = vi.fn()
      .mockImplementation(() => Promise.resolve(expectedReplies));

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const thread = await getThreadUseCase.execute(useCasePayload.threadId);

    // Assert
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toHaveBeenCalledWith(useCasePayload.threadId);

    expect(thread).toStrictEqual({
      ...expectedThread,
      comments: [
        {
          id: 'comment-1',
          username: 'johndoe',
          date: '2023-01-01T01:00:00.000Z',
          replies: [ // <-- Balasan harus masuk ke dalam komentar
            { id: 'reply-1', content: 'balasan aman', date: '2023-01-01T02:00:00.000Z', username: 'dicoding' },
            { id: 'reply-2', content: '**balasan telah dihapus**', date: '2023-01-01T03:00:00.000Z', username: 'johndoe' }, 
          ],
          likeCount: 2,
          content: 'komentar pertama',
        },
        {
          id: 'comment-2',
          username: 'dicoding',
          date: '2023-01-01T02:00:00.000Z',
          replies: [], // Array kosong karena gak ada balasan
          likeCount: 0,
          content: '**komentar telah dihapus**', // Harus tersensor
        },
      ],
    });
  });
});