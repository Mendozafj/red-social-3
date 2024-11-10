var express = require('express');
var router = express.Router();
var usersController = require("../controllers/users.c");
var commentsModel = require("../models/comments.m");

/* POST registrar usuarios */
router.post('/', async (req, res) => {
  try {
    const result = await usersController.register(req.body);
    if (result.error) {
      return res.status(400).send(result.error);
    }
    return res.status(201).send("Usuario creado");
  } catch (error) {
    res.status(500).send("Error al registrar el usuario");
  }
});

/* GET mostrar usuarios. */
router.get('/', async (req, res) => {
  try {
    const users = await usersController.show();
    res.status(200).render('users', { users });  // Renderiza la vista 'users.ejs'
  } catch (err) {
    res.status(500).send(`Error al listar usuarios: ${err}`);
  }
});


/* GET mostrar usuario por id */
router.get('/:id', async (req, res) => {
  try {
    const user = await usersController.showByID(req.params.id);
    if (!user) {
      return res.status(404).send(`No se encontró el usuario con id: ${req.params.id}`);
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(`Error al buscar usuario: ${err}`);
  }
});

/* GET mostrar publicaciones de un usuario por id */
router.get('/:id/posts', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await usersController.showByID(id);
    if (!user) {
      return res.status(404).send(`No se encontró el usuario con id: ${req.params.id}`);
    }

    // Obtener publicaciones del usuario
    const posts = await usersController.showPosts(id);

    // Crea un array de promesas para obtener los usuarios de cada publicación
    const userPromises = posts.map(post => {
      return usersController.showByID(post.user_id); // Asumiendo que cada post tiene un user_id
    });

    // Espera a que todas las promesas se resuelvan
    const users = await Promise.all(userPromises);

    // Combina publicaciones con sus respectivos usuarios
    const postsWithUsers = posts.map((post, index) => ({
      ...post,
      user: users[index], // Agrega el usuario a cada publicación
    }));

    // Obtener comentarios para cada publicación
    const postsWithComments = await Promise.all(
      postsWithUsers.map(async (post) => {
        const comments = await commentsModel.showByPostID(post.id); // Asegúrate de que este método exista
        return { ...post, comments }; // Agrega los comentarios a la publicación
      })
    );

    res.status(200).render('user_posts', { user, posts: postsWithComments });  // Renderiza la vista 'user_posts.ejs'
  } catch (err) {
    res.status(500).send(`Error al buscar las publicaciones del usuario: ${err}`);
  }
});



/* GET mostrar usuario por username */
router.get('/username/:username', async (req, res) => {
  try {
    const user = await usersController.showByUsername(req.params.username);
    if (!user) {
      return res.status(404).send(`No se encontró el usuario con username: ${req.params.username}`);
    }
    res.status(200).send(user);
  } catch (err) {
    res.status(500).send(`Error al buscar usuario: ${err}`);
  }
});

/* GET mostrar solicitudes de amistad de un usuario por id */
router.get('/:id/friend-request', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await usersController.showByID(id);
    if (!user) {
      return res.status(404).send(`No se encontró el usuario con id: ${req.params.id}`);
    }

    // Obtener las solicitudes de amistad
    const friendRequests = await usersController.showFriendRequests(id);

    // Filtrar solo las solicitudes con status "pendiente"
    const pendingRequests = friendRequests.filter(request => request.status === 'pendiente');

    // Si las solicitudes no traen el username, obtenlo
    const requestsWithUsernames = await Promise.all(pendingRequests.map(async (request) => {
      const sender = await usersController.showByID(request.sender_id); // Ajusta según tu modelo
      return {
        ...request,
        sender_username: sender.username // Agrega el username del remitente
      };
    }));

    // Obtén la lista de todos los usuarios
    const allUsers = await usersController.show(); // Asegúrate de que este método exista

    // Filtra la lista de usuarios para omitir el usuario actual
    const users = allUsers.filter(u => u.id !== id);

    // Renderiza la vista 'friend_requests.ejs' pasando el usuario, las solicitudes de amistad y los usuarios filtrados
    res.status(200).render('friend_requests', { user, friendRequests: requestsWithUsernames, users });
  } catch (err) {
    res.status(500).send(`Error al buscar las solicitudes de amistad: ${err}`);
  }
});

/* GET mostrar amistades de un usuario por id */
router.get('/:id/friends', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await usersController.showByID(id);
    if (!user) {
      return res.status(404).send(`No se encontró el usuario con id: ${req.params.id}`);
    }
    const friends = await usersController.showFriends(id);
    res.status(200).render('user_friends', { user, friends });  // Renderiza la vista 'user_friends.ejs'
  } catch (err) {
    res.status(500).send(`Error al buscar las amistades del usuario: ${err}`);
  }
});

/* GET mostrar feed de publicaciones (mostrando la última publicación de cada usuario "amigo") */
router.get('/:id/feed', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await usersController.showByID(id);
    if (!user) {
      return res.status(404).send(`No se encontró el usuario con id: ${req.params.id}`);
    }
    const feed = await usersController.showFeed(id);

    res.status(200).send(feed);
  } catch (err) {
    res.status(500).send(`Error el feed del usuario: ${err}`);
  }
});


/* PUT editar usuario */
router.put('/:id', async (req, res) => {
  try {
    const result = await usersController.update(req.params.id, req.body);
    if (result.error) {
      return res.status(400).send(result.error);
    }
    res.status(200).send("Usuario editado");
  } catch (err) {
    res.status(500).send(`Error al editar el usuario: ${err}`);
  }
});

/* DELETE eliminar usuario */
router.delete('/:id', async (req, res) => {
  try {
    const result = await usersController.delete(req.params.id);
    if (result.error) {
      return res.status(400).send(result.error);
    }
    res.status(200).send("Usuario eliminado")
  } catch (err) {
    res.status(500).send(`Error al eliminar usuario: ${err}`);
  }
});

module.exports = router;