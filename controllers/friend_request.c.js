const friendRequestModel = require("../models/friend_request.m");
const usersModel = require("../models/users.m");
const friendshipsModel = require("../models/friendships.m");

class FriendRequestController {
  async create(data) {
    const { sender_id, receiver_id } = data;
    if (!sender_id || !receiver_id) {
      return { error: "Todos los campos son requeridos." };
    }

    try {
      const user1 = await usersModel.showByID(sender_id);
      if (!user1) {
        return { error: `No se encontró el usuario con id: ${sender_id}` };
      }

      const user2 = await usersModel.showByID(receiver_id);
      if (!user2) {
        return { error: `No se encontró el usuario con id: ${receiver_id}` };
      }

      if (user1.username == user2.username) {
        return { error: `Los usuarios deben ser diferentes` };
      }

      const newFriendRequest = { sender_id, receiver_id, status: "pendiente" };
      await friendRequestModel.create(newFriendRequest);

      return { success: true };
    } catch (error) {
      return { error: `Error al crear la solicitud de amistad: ${error.message}` };
    }
  }

  async show() {
    try {
      const friendRequests = await friendRequestModel.show();
      return friendRequests;
    } catch (err) {
      throw new Error(`Error al listar las solicitudes de amistad: ${err}`);
    }
  }

  async showByID(id) {
    try {
      const friendRequest = await friendRequestModel.showByID(id);
      return friendRequest;
    } catch (err) {
      throw new Error(`Error al buscar solicitudes de amistad: ${err}`);
    }
  }

  async update(id, data) {
    const { status } = data;
    try {
      const friendRequest = await friendRequestModel.showByID(id);
      if (!friendRequest) {
        return { error: `No se encontró la solicitud de amistad con id: ${id}` };
      }

      if (friendRequest.status == "aceptada" || friendRequest.status == "rechazada") {
        return { error: `No se puede editar la solicitud de amistad` };
      }

      if (status == "aceptada") {
        const newFriendships = {
          user_id_1: friendRequest.sender_id,
          user_id_2: friendRequest.receiver_id
        };
        await friendshipsModel.create(newFriendships);
      }

      const result = await friendRequestModel.edit({ status }, id);
      return result ? { success: true } : { error: "No se pudo actualizar la solicitud" };
    } catch (err) {
      throw new Error(`Error al editar solicitud de amistad: ${err}`);
    }
  }

  async delete(id) {
    try {
      const friendRequest = await friendRequestModel.showByID(id);
      if (!friendRequest) {
        return { error: `No se encontró la solicitud de amistad con id: ${id}` };
      }

      const result = await friendRequestModel.delete(id);
      return result ? { success: true } : { error: "No se pudo eliminar la solicitud" };
    } catch (err) {
      throw new Error(`Error al eliminar solicitud de amistad: ${err}`);
    }
  }
}

module.exports = new FriendRequestController();