const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class CommentsModel {
  // Método para crear un nuevo comentario
  async create(comment) {
    return new Promise((resolve, reject) => {
      comment.id = uuidv4(); // Genera un nuevo ID
      const query = 'INSERT INTO comments (id, content, post_id, user_id) VALUES (?, ?, ?, ?)';
      const values = [comment.id, comment.content, comment.post_id, comment.user_id];

      pool.query(query, values)
        .then(([result]) => resolve({ id: comment.id, ...comment }))
        .catch(error => reject(error));
    });
  }

  // Método para mostrar todos los comentarios
  async show() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM comments';

      pool.query(query)
        .then(([rows]) => resolve(rows))
        .catch(error => reject(error));
    });
  }

  // Método para mostrar un comentario por su ID
  async showByID(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM comments WHERE id = ?';

      pool.query(query, [id])
        .then(([rows]) => resolve(rows[0]))
        .catch(error => reject(error));
    });
  }

  // Método para mostrar comentarios por ID de publicación
  async showByPostID(post_id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM comments WHERE post_id = ?';

      pool.query(query, [post_id])
        .then(([rows]) => resolve(rows))
        .catch(error => reject(error));
    });
  }

  // Método para editar un comentario por su ID
  async edit(updatedComment, id) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE comments SET content = ? WHERE id = ?';
      const values = [updatedComment.content, id];

      pool.query(query, values)
        .then(([result]) => resolve(result.affectedRows))
        .catch(error => reject(error));
    });
  }

  // Método para eliminar un comentario por su ID
  async delete(id) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM comments WHERE id = ?';

      pool.query(query, [id])
        .then(([result]) => resolve(result.affectedRows))
        .catch(error => reject(error));
    });
  }
}

module.exports = new CommentsModel();