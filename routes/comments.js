var express = require('express');
var router = express.Router();
var commentsController = require("../controllers/comments.c");
const { verifyToken, verifyRole } = require("../middlewares/auth");

/* POST crear comentario */
router.post('/', verifyToken, verifyRole(['usuario', 'admin']), async (req, res) => {
  try {
    const result = await commentsController.create(req.body);
    if (result.error) {
      return res.status(400).send(result.error);
    }
    return res.status(201).send("Comentario creado");
  } catch (error) {
    res.status(500).send("Error al crear el comentario");
  }
});

/* GET mostrar comentarios. */
router.get('/', verifyToken, verifyRole(['usuario', 'admin']), async (req, res) => {
  try {
    const comments = await commentsController.show();
    res.status(200).send(comments);
  } catch (err) {
    res.status(500).send(`Error al listar comentarios: ${err}`);
  }
});

/* GET mostrar comentario por id */
router.get('/:id', verifyToken, verifyRole(['usuario', 'admin']), async (req, res) => {
  try {
    const comment = await commentsController.showByID(req.params.id);
    if (!comment) {
      return res.status(404).send(`No se encontró el comentario con id: ${req.params.id}`);
    }
    res.status(200).send(comment);
  } catch (err) {
    res.status(500).send(`Error al buscar comentario: ${err}`);
  }
});

/* PUT editar comentario */
router.put('/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const result = await commentsController.update(req.params.id, req.body);
    if (result.error) {
      return res.status(400).send(result.error);
    }
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(`Error al editar el comentario: ${err}`);
  }
});

/* DELETE eliminar comentario */
router.delete('/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const result = await commentsController.delete(req.params.id);
    if (result.error) {
      return res.status(400).send(result.error);
    }
    res.status(200).send("Comentario eliminado")
  } catch (err) {
    res.status(500).send(`Error al eliminar comentario: ${err}`);
  }
});

module.exports = router;