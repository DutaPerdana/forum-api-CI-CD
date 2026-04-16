import pool from '../src/Infrastructures/database/postgres/pool.js';

const RepliesTableTestHelper = {
  async addReply({
    id = 'reply-123', commentId = 'comment-123', owner = 'user-123', content = 'sebuah balasan', date = new Date().toISOString(),
  }) {
    const query = {
      text: 'INSERT INTO replies (id, comment_id, owner, content, date) VALUES($1, $2, $3, $4, $5)',
      values: [id, commentId, owner, content, date],
    };

    await pool.query(query);
  },

  async findReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM replies WHERE 1=1');
  },
};

export default RepliesTableTestHelper;