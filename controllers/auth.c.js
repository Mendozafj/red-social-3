const usersModel = require('../models/users.m');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class AuthController {
  async register(data) {
    const { name, username, email, password, role } = data;
    if (!name || !username || !email || !password || !role) {
      throw new Error("Todos los campos son requeridos.");
    }

    try {
      const user = await usersModel.showByUsername(username);
      if (user) {
        throw new Error("El nombre de usuario ya está en uso.");
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { name, username, email, password: hashedPassword, role };
      await usersModel.register(newUser);

      return { redirect: '/auth/login' };
    } catch (error) {
      throw new Error(`Error al registrar usuario: ${error.message}`);
    }
  }

  async login(data) {
    const { username, password } = data;
    if (!username || !password) {
      throw new Error("El nombre de usuario y la contraseña son requeridos.");
    }

    try {
      const user = await usersModel.showByUsername(username);
      if (!user) {
        throw new Error("Nombre de usuario o contraseña incorrectos.");
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error("Nombre de usuario o contraseña incorrectos.");
      }

      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return { token, redirect: `/users/${user.id}/feed` };
    } catch (error) {
      throw new Error(`Error al iniciar sesión: ${error.message}`);
    }
  }

  async logout() {
    return { redirect: '/auth/login' };
  }
}

module.exports = new AuthController();