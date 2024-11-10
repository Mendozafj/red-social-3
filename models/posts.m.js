const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

class PostsModel {
  // Método para crear una nueva publicación
  async create(post) {
    return new Promise((resolve, reject) => {
      const id = uuidv4(); // Generar un nuevo ID
      const query = 'INSERT INTO posts (id, title, description, url_multimedia, user_id) VALUES (?, ?, ?, ?, ?)';
      const values = [id, post.title, post.description, post.url_multimedia, post.user_id];

      pool.query(query, values)
        .then(() => resolve({ id, ...post })) // Retorna el nuevo post con el ID asignado
        .catch(error => reject(error)); 
    });
  }

  // Método para mostrar todas las publicaciones
  async show() {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM posts';

      pool.query(query)
        .then(([rows]) => resolve(rows)) // Retorna las filas de publicaciones
        .catch(error => reject(error)); 
    });
  }

  // Método para mostrar una publicación por su ID
  async showByID(id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM posts WHERE id = ?';

      pool.query(query, [id])
        .then(([rows]) => resolve(rows.length > 0 ? rows[0] : null)) // Retorna la publicación o null
        .catch(error => reject(error)); 
    });
  }

  // Método para mostrar publicaciones por el ID de usuario
  async showByUserID(user_id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM posts WHERE user_id = ?';

      pool.query(query, [user_id])
        .then(([rows]) => resolve(rows)) // Retorna las publicaciones del usuario
        .catch(error => reject(error)); 
    });
  }

  // Método para obtener la última publicación de un usuario
  async getLastPostByUser(user_id) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC LIMIT 1';

      pool.query(query, [user_id])
        .then(([rows]) => resolve(rows.length > 0 ? rows[0] : null)) // Retorna la última publicación o null
        .catch(error => reject(error)); 
    });
  }

  // Método para editar una publicación por su ID
  async edit(updatedPost, id) {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE posts SET title = ?, description = ?, url_multimedia = ? WHERE id = ?';
      const values = [updatedPost.title, updatedPost.description, updatedPost.url_multimedia, id];

      pool.query(query, values)
        .then(() => this.showByID(id).then(post => resolve(post))) // Retorna la publicación actualizada
        .catch(error => reject(error)); 
    });
  }

  // Método para eliminar una publicación por su ID
  async delete(id) {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM posts WHERE id = ?';

      pool.query(query, [id])
        .then(([result]) => resolve({ success: result.affectedRows > 0 })) // Retorna éxito si se eliminó
        .catch(error => reject(error)); 
    });
  }
}

module.exports = new PostsModel();