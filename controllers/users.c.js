const usersModel = require("../models/users.m");
const postsModel = require("../models/posts.m");
const commentsModel = require("../models/comments.m");
const friendRequestModel = require("../models/friend_request.m");
const friendshipsModel = require("../models/friendships.m");
const moment = require('moment');

class UsersController {
  async show() {
    try {
      const users = await usersModel.show();
      return users;
    } catch (err) {
      throw new Error(`Error al listar usuarios: ${err}`);
    }
  }

  async showByID(id) {
    try {
      const user = await usersModel.showByID(id);
      if (!user) {
        return false;
      }
      return user;
    } catch (err) {
      throw new Error(`Error al buscar usuario: ${err}`);
    }
  }

  async showByUsername(username) {
    try {
      const user = await usersModel.showByUsername(username);
      return user;
    } catch (err) {
      throw new Error(`Error al buscar usuario: ${err}`);
    }
  }

  async showPosts(id) {
    try {
      const posts = await postsModel.showByUserID(id);
      return posts;
    } catch (err) {
      throw new Error(`Error al buscar las publicaciones del usuario: ${err}`);
    }
  }

  async showFriendRequests(id) {
    try {
      const friendRequests = await friendRequestModel.showByUserID(id);
      return friendRequests;
    } catch (err) {
      throw new Error(`Error al buscar las solicitudes de amistad: ${err}`);
    }
  }

  async showFriends(id) {
    try {
      const friendsIds = await friendshipsModel.showByUserID(id);

      if (friendsIds.length === 0) {
        return [];
      }

      const friends = await Promise.all(
        friendsIds.map(friendId => usersModel.showByID(friendId))
      );

      const flattenedFriends = friends.flat();
      return flattenedFriends;
    } catch (err) {
      throw new Error(`Error al buscar los amigos del usuario: ${err}`);
    }
  }

  async showFeed(id) {
    try {
      // Obtener las relaciones de amistad
      const friends = await friendshipsModel.showByUserID(id);

      // Obtener las publicaciones de los amigos
      const feed = await Promise.all(
        friends.map(async (friendId) => {
          // Obtener la última publicación de cada amigo
          const post = await postsModel.getLastPostByUser(friendId);

          if (post) {
            // Verificar el valor de created_at
            console.log('created_at (post):', post.created_at);

            // Si created_at no es un objeto de tipo Date, intentar convertirlo
            if (post.created_at && !(post.created_at instanceof Date)) {
              post.created_at = new Date(post.created_at); // Convertir a tipo Date si es necesario
            }

            // Verificar que la conversión a Date haya sido exitosa
            if (post.created_at instanceof Date && !isNaN(post.created_at)) {
              post.formatted_date = moment(post.created_at).format('DD/MM/YYYY HH:mm:ss');
            } else {
              post.formatted_date = 'Fecha inválida'; // Si la fecha es inválida
            }

            // Obtener el nombre del usuario que publicó la publicación
            const user = await usersModel.showByID(post.user_id);  // Usamos user_id para buscar el usuario
            post.user_name = user ? user.name : 'Desconocido'; // Si el usuario no se encuentra, asignamos 'Desconocido'
            post.user_username = user ? user.username : 'Desconocido'; // Si el usuario no se encuentra, asignamos 'Desconocido'

            // Obtener los comentarios de la publicación
            const comments = await commentsModel.showByPostID(post.id);

            // Formatear cada comentario
            const formattedComments = await Promise.all(comments.map(async (comment) => {
              // Obtener el nombre del usuario que hizo el comentario
              const commentUser = await usersModel.showByID(comment.user_id);
              comment.user_name = commentUser ? commentUser.name : 'Desconocido'; // Si el usuario no se encuentra, asignamos 'Desconocido'
              comment.user_username = commentUser ? commentUser.username : 'Desconocido'; // Si el usuario no se encuentra, asignamos 'Desconocido'

              // Formatear la fecha de created_at
              if (comment.created_at && !(comment.created_at instanceof Date)) {
                comment.created_at = new Date(comment.created_at); // Convertir a tipo Date si es necesario
              }

              if (comment.created_at instanceof Date && !isNaN(comment.created_at)) {
                comment.formatted_date = moment(comment.created_at).format('DD/MM/YYYY HH:mm:ss');
              } else {
                comment.formatted_date = 'Fecha inválida'; // Si la fecha es inválida
              }

              return comment;
            }));

            // Asignamos los comentarios formateados a la publicación
            post.comments = formattedComments;
          }

          console.log(post)

          return post;
        })
      );
      // Filtrar las publicaciones nulas
      return feed.filter(post => post !== null);
    } catch (err) {
      throw new Error(`Error al obtener el feed de publicaciones: ${err}`);
    }
  }


  async update(id, data) {
    const { name, username, password, email } = data;

    try {
      const user = await usersModel.showByID(id);
      if (!user) {
        return { error: `No se encontró el usuario con id: ${id}` };
      }

      if (username) {
        const existingUser = await usersModel.showByUsernameExcludingID(username, id);
        if (existingUser) {
          return { error: "El nombre de usuario ya está en uso por otro usuario." };
        }
      }

      if (email) {
        const existingEmail = await usersModel.showByEmailExcludingID(email, id);
        if (existingEmail) {
          return { error: "El correo electrónico ya está en uso por otro usuario." };
        }
      }

      const updatedUser = {
        name: name || user.name,
        username: username || user.username,
        password: password || user.password,
        email: email || user.email
      };

      await usersModel.edit(updatedUser, id);

      return { success: true };
    } catch (err) {
      throw new Error(`Error al editar el usuario: ${err}`);
    }
  }

  async delete(id) {
    try {
      const user = await usersModel.showByID(id);
      if (!user) {
        return { error: `No se encontró el usuario con id: ${id}` };
      }

      await usersModel.delete(id);
      return { success: true };
    } catch (err) {
      throw new Error(`Error al eliminar usuario: ${err}`);
    }
  }
}

module.exports = new UsersController();
