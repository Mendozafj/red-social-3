var express = require('express');
var router = express.Router();
var friendRequestController = require("../controllers/friend_request.c");
const { verifyToken, verifyRole } = require("../middlewares/auth");

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

// Ruta para crear una solicitud de amistad
router.post('/', verifyToken, verifyRole(['usuario', 'admin']), async (req, res) => {
  try {
    const result = await friendRequestController.create(req.body);

    if (result.error) {
      return res.status(400).json({ success: false, error: result.error });
    }

    res.status(200).json({ success: true });  // Solo indicar éxito, sin redirigir
  } catch (err) {
    res.status(500).json({ success: false, error: `Error al crear la solicitud: ${err}` });
  }
});

// Ruta para editar una solicitud de amistad
router.put('/:id', verifyToken, verifyRole(['usuario', 'admin']), async (req, res) => {
  try {
    const result = await friendRequestController.update(req.params.id, req.body);

    if (result.error) {
      return res.status(400).json({ success: false, error: result.error });
    }

    res.status(200).json({ success: true });  // Solo indicar éxito, sin redirigir
  } catch (err) {
    res.status(500).json({ success: false, error: `Error al editar la solicitud: ${err}` });
  }
});

// Ruta para eliminar una solicitud de amistad
router.delete('/:id', verifyToken, verifyRole(['usuario', 'admin']), async (req, res) => {
  try {
    const result = await friendRequestController.delete(req.params.id);

    if (result.error) {
      return res.status(400).json({ success: false, error: result.error });
    }

    res.status(200).json({ success: true });  // Solo indicar éxito, sin redirigir
  } catch (err) {
    res.status(500).json({ success: false, error: `Error al eliminar la solicitud: ${err}` });
  }
});

module.exports = router;