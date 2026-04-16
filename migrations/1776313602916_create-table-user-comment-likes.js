export const up = (pgm) => {
  pgm.createTable('user_comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });

  // Constraint Foreign Key ke tabel users
  pgm.addConstraint(
    'user_comment_likes',
    'fk_user_comment_likes.user_id_users.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE'
  );

  // Constraint Foreign Key ke tabel comments
  pgm.addConstraint(
    'user_comment_likes',
    'fk_user_comment_likes.comment_id_comments.id',
    'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE'
  );

  // Constraint UNIQUE agar 1 user hanya bisa like 1 komentar maksimal 1 kali
  pgm.addConstraint(
    'user_comment_likes',
    'unique_user_id_and_comment_id',
    'UNIQUE(user_id, comment_id)'
  );
};

export const down = (pgm) => {
  pgm.dropTable('user_comment_likes');
};