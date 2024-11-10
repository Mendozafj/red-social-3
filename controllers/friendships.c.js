const friendsModel = require("../models/friendships.m");

class FriendsController {
  // Método para mostrar todas las amistades
  async show() {
    return friendsModel.show()
      .then(friendships => friendships)
      .catch(error => { throw new Error(`Error al listar las amistades: ${error}`); });
  }

  // Método para mostrar una amistad por su ID
  async showByID(id) {
    return friendsModel.showByID(id)
      .then(friendship => friendship)
      .catch(error => { throw new Error(`Error al buscar amistad: ${error}`); });
  }

  // Método para eliminar una amistad por su ID
  async delete(id) {
    return friendsModel.showByID(id)
      .then(friendship => {
        if (!friendship) {
          return { error: `No se encontró la amistad con id: ${id}` };
        }
        return friendsModel.delete(id);
      })
      .catch(error => { throw new Error(`Error al eliminar amistad: ${error}`); });
  }
}

module.exports = new FriendsController();