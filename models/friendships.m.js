const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class FriendshipModel {
  // Método para crear una nueva relación de amistad
  async create(friendship) {
    return new Promise((resolve, reject) => {
      friendship.id = uuidv4();
      const query = 'INSERT INTO friendships (id, user_id_1, user_id_2, created_at) VALUES (?, ?, ?, ?)';
      const values = [friendship.id, friendship.user_id_1, friendship.user_id_2, new Date()];

      pool.query(query, values)
        .then(([result]) => resolve({ id: friendship.id, ...friendship }))
        .catch(error => reject(error));
    });
  }

  // Método para mostrar todas las relaciones de amistad
  async show() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM friendships';

      pool.query(query)
        .then(([rows]) => resolve(rows))
        .catch(error => reject(error));
    });
  }

  // Método para mostrar una relación de amistad por su ID
  async showByID(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM friendships WHERE id = ?';

      pool.query(query, [id])
        .then(([rows]) => resolve(rows[0]))
        .catch(error => reject(error));
    });
  }

  // Método para mostrar relaciones de amistad por ID de usuario
  async showByUserID(userId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT CASE 
          WHEN user_id_1 = ? THEN user_id_2 
          WHEN user_id_2 = ? THEN user_id_1 
          END AS friend_id
        FROM friendships
        WHERE user_id_1 = ? OR user_id_2 = ?`;

      pool.query(query, [userId, userId, userId, userId])
        .then(([rows]) => resolve(rows.map(row => row.friend_id)))
        .catch(error => reject(error));
    });
  }

  // Método para eliminar una relación de amistad por su ID
  async delete(id) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM friendships WHERE id = ?';

      pool.query(query, [id])
        .then(([result]) => resolve(result.affectedRows))
        .catch(error => reject(error));
    });
  }
}

module.exports = new FriendshipModel();