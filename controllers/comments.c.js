var commentsModel = require("../models/comments.m");
var usersModel = require("../models/users.m");
var postsModel = require("../models/posts.m");

class CommentsController {
  async create(data) {
    const { content, post_id, user_id } = data;
    if (!content || !post_id || !user_id) {
      return { error: "Todos los campos son requeridos." };
    }

    try {
      const post = await postsModel.showByID(post_id);
      if (!post) {
        return { error: `No se encontró la publicación con id: ${post_id}` };
      }

      const user = await usersModel.showByID(user_id);
      if (!user) {
        return { error: `No se encontró el usuario con id: ${user_id}` };
      }

      const newComment = { content, post_id, user_id };
      const result = await commentsModel.create(newComment);

      return { success: true, comment: result };
    } catch (error) {
      return { error: `Error al crear el comentario: ${error.message}` };
    }
  }

  async show() {
    try {
      const comments = await commentsModel.show();
      return comments;
    } catch (err) {
      throw new Error(`Error al listar los comentarios: ${err}`);
    }
  }

  async showByID(id) {
    try {
      const comment = await commentsModel.showByID(id);
      return comment;
    } catch (err) {
      throw new Error(`Error al buscar el comentario: ${err}`);
    }
  }

  async update(id, data) {
    const { content } = data;
    try {
      const comment = await commentsModel.showByID(id);
      if (!comment) {
        return { error: `No se encontró el comentario con id: ${id}` };
      }

      const updatedComment = {
        ...comment,
        content: content ? content : comment.content,
      };

      const result = await commentsModel.edit(updatedComment, id);
      return { success: true, updatedComment: result };
    } catch (err) {
      throw new Error(`Error al editar comentario: ${err}`);
    }
  }

  async delete(id) {
    try {
      const comment = await commentsModel.showByID(id);
      if (!comment) {
        return { error: `No se encontró el comentario con id: ${id}` };
      }

      await commentsModel.delete(id);
      return { success: true };
    } catch (err) {
      throw new Error(`Error al eliminar comentario: ${err}`);
    }
  }
}

module.exports = new CommentsController();