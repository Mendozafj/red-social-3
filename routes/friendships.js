var express = require('express');
var router = express.Router();
var friendshipController = require("../controllers/friendships.c");

/* GET mostrar amistades */
router.get('/', async (req, res) => {
  try {
    const friendships = await friendshipController.show();
    res.status(200).send(friendships);
  } catch (err) {
    res.status(500).send(`Error al listar amistades: ${err}`);
  }
});

/* GET mostrar amistad por id */
router.get('/:id', async (req, res) => {
  try {
    const friendship = await friendshipController.showByID(req.params.id);
    if (!friendship) {
      return res.status(404).send(`No se encontró la amistad con id: ${req.params.id}`);
    }
    res.status(200).send(friendship);
  } catch (err) {
    res.status(500).send(`Error al buscar amistad: ${err}`);
  }
});

/* DELETE eliminar amistad */
router.delete('/:id', async (req, res) => {
  try {
    const result = await friendshipController.delete(req.params.id);
    if (result.error) {
      return res.status(400).send(result.error);
    }
    res.status(200).send("Amistad eliminada")
  } catch (err) {
    res.status(500).send(`Error al eliminar la amistad: ${err}`);
  }
});

module.exports = router;