const usersModel = require("../models/users.m");
const postsModel = require("../models/posts.m");
const friendRequestModel = require("../models/friend_request.m");
const friendshipsModel = require("../models/friendships.m");

class UsersController {
  async register(data) {
    const { name, username, password, email } = data;
    if (!name || !username || !password || !email) {
      return { error: "Todos los campos son requeridos." };
    }

    try {
      const userByUsername = await usersModel.showByUsername(username);
      if (userByUsername) {
        return { error: "El nombre de usuario ya está en uso." };
      }

      const userByEmail = await usersModel.showByEmail(email);
      if (userByEmail) {
        return { error: "El correo electrónico ya está en uso." };
      }

      const newUser = { name, username, password, email };
      await usersModel.register(newUser);

      return { success: true };
    } catch (error) {
      return { error: `Error al registrar usuario: ${error.message}` };
    }
  }

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
      const friends = await friendshipsModel.showByUserID(id); 
      const feed = await Promise.all(
        friends.map(async friendId => {
          const post = await postsModel.getLastPostByUser(friendId); 
          return post;
        })
      );
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
