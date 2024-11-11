'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comments', {
      id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        primaryKey: true,
      },
      post_id: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      user_id: {
        type: Sequelize.CHAR(36),
        allowNull: true,
      },
      content: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('comments');
  },
};
