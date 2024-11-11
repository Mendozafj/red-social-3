var express = require('express');
var router = express.Router();
var friendRequestController = require("../controllers/friend_request.c");
const { verifyToken, verifyRole } = require("../middlewares/auth");

router.post('/', verifyToken, verifyRole(['usuario', 'admin']), async (req, res) => {
  try {
    const result = await friendRequestController.create(req.body);
    if (result.error) {
      return res.status(400).render('error', { message: result.error });

    }
    return res.redirect('/users');
  } catch (error) {
    res.status(500).render('error', { message: "Error al crear la solicitud de amistad" });
  }
});

/* GET mostrar solicitud de amistad */
router.get('/', verifyToken, verifyRole(['usuario', 'admin']), async (req, res) => {
  try {
    const friendRequest = await friendRequestController.show();
    res.status(200).send(friendRequest);
  } catch (err) {
    res.status(500).send(`Error al listar solicitudes de amistad: ${err}`);
  }
});

/* GET mostrar solicitud de amistad por id */
router.get('/:id', verifyToken, verifyRole(['usuario', 'admin']), async (req, res) => {
  try {
    const friendRequest = await friendRequestController.showByID(req.params.id);
    if (!friendRequest) {
      return res.status(404).send(`No se encontró la solicitud de amistad con id: ${req.params.id}`);
    }
    res.status(200).send(friendRequest);
  } catch (err) {
    res.status(500).send(`Error al buscar solicitud de amistad: ${err}`);
  }
});

/* PUT editar solicitud de amistad */
router.put('/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const result = await friendRequestController.update(req.params.id, req.body);
    if (result.error) {
      return res.status(400).send(result.error);
    }
    res.status(200).redirect("/users");
  } catch (err) {
    res.status(500).send(`Error al editar la solicitud de amistad: ${err}`);
  }
});

/* DELETE eliminar solicitud de amistad */
router.delete('/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const result = await friendRequestController.delete(req.params.id);
    if (result.error) {
      return res.status(400).send(result.error);
    }
    res.status(200).send("Solicitud de amistad eliminada")
  } catch (err) {
    res.status(500).send(`Error al eliminar la solicitud de amistad: ${err}`);
  }
});

module.exports = router;