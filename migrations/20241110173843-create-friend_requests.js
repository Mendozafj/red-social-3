'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('friend_requests', {
      id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        primaryKey: true,
      },
      sender_id: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      receiver_id: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('friend_requests');
  },
};