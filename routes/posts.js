var express = require('express');
var router = express.Router();
var postsController = require("../controllers/posts.c");

/* POST crear publicaciones */
router.post('/', async (req, res) => {
  try {
    const result = await postsController.create(req.body);
    if (result.error) {
      return res.status(400).json({ success: false, error: result.error });
    }
    return res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error al crear la publicación" });
  }
});

/* GET mostrar pubicaciones. */
router.get('/', async (req, res) => {
  try {
    const posts = await postsController.show();
    res.status(200).send(posts);
  } catch (err) {
    res.status(500).send(`Error al listar publicaciones: ${err}`);
  }
});

/* GET mostrar publicación por id */
router.get('/:id', async (req, res) => {
  try {
    const post = await postsController.showByID(req.params.id);
    if (!post) {
      return res.status(404).send(`No se encontró la publicación con id: ${req.params.id}`);
    }
    res.status(200).send(post);
  } catch (err) {
    res.status(500).send(`Error al buscar publicación: ${err}`);
  }
});

/* GET mostrar comentarios de una publicación por id */
router.get('/:id/comments', async (req, res) => {
  const { id } = req.params;
  try {
    const post = await postsController.showByID(id);
    if (!post) {
      return res.status(404).send(`No se encontró la publicación con id: ${req.params.id}`);
    }

    const comments = await postsController.showComments(id);
    res.status(200).send(comments);
  } catch (err) {
    res.status(500).send(`Error al buscar los comentarios de la publicación: ${err}`);
  }
});

// Obtener la publicación para editar
router.get('/:id/edit', async (req, res) => {
  try {
    const id = req.params.id;
    const post = await postsController.showByID(id); // Método para obtener la publicación

    res.render('edit_post', { post }); // Renderiza la vista de edición
  } catch (error) {
    res.status(500).render('error', { message: "Error al cargar la publicación." });
  }
});

/* PUT editar publicación */
router.put('/:id', async (req, res) => {
  try {
    const result = await postsController.update(req.params.id, req.body);
    if (result.error) {
      return res.status(400).json({ success: false, error: result.error });
    }

    // Obtener la ruta anterior desde la cabecera Referer
    const previousUrl = req.get('Referer') || '/'; // Ruta por defecto en caso de que Referer no esté definido

    res.status(200).json({ success: true, redirectUrl: previousUrl });
  } catch (err) {
    res.status(500).json({ success: false, error: `Error al editar la publicación: ${err}` });
  }
});

/* DELETE eliminar publicación */
router.delete('/:id', async (req, res) => {
  try {
    const result = await postsController.delete(req.params.id);
    if (result.error) {
      return res.status(400).json({ error: result.error });
    }
    return res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: `Error al eliminar la publicación: ${err}` });
  }
});

module.exports = router;