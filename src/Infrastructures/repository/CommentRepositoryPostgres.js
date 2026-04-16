import AddedComment from '../../Domains/comments/entities/AddedComment.js';
import CommentRepository from '../../Domains/comments/CommentRepository.js';
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';
import AuthorizationError from '../../Commons/exceptions/AuthorizationError.js';

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { threadId, content, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO comments (id, thread_id, owner, content, date) VALUES($1, $2, $3, $4, $5) RETURNING id, content, owner',
      values: [id, threadId, owner, content, date],
    };

    const result = await this._pool.query(query);

    return new AddedComment({ ...result.rows[0] });
  }

  async checkCommentAvailability(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: 'SELECT owner FROM comments WHERE id = $1',
      values: [commentId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount === 0) {
      throw new NotFoundError('komentar tidak ditemukan');
    }

    const comment = result.rows[0];

    if (comment.owner !== owner) {
      throw new AuthorizationError('anda tidak berhak mengakses *resource* ini');
    }
  }

  async deleteComment(commentId) {
    // Ingat, ini SOFT DELETE. Kita tidak pakai "DELETE FROM...", melainkan "UPDATE"
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [commentId],
    };

    await this._pool.query(query);
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT 
                comments.id, 
                users.username, 
                comments.date, 
                comments.content, 
                comments.is_delete,
                CAST(COUNT(user_comment_likes.id) AS INTEGER) AS "likeCount"
             FROM comments
             LEFT JOIN users ON comments.owner = users.id
             LEFT JOIN user_comment_likes ON comments.id = user_comment_likes.comment_id
             WHERE comments.thread_id = $1
             GROUP BY comments.id, users.username
             ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  // async getCommentsByThreadId(threadId) {
  //   const query = {
  //     text: `SELECT comments.id, users.username, comments.date, comments.content, comments.is_delete 
  //            FROM comments 
  //            LEFT JOIN users ON comments.owner = users.id 
  //            WHERE comments.thread_id = $1 
  //            ORDER BY comments.date ASC`,
  //     values: [threadId],
  //   };

  //   const result = await this._pool.query(query);

  //   return result.rows;
  // }

}

export default CommentRepositoryPostgres;