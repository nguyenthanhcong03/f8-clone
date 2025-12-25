'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Rename name -> fullName (GIỮ DATA)
    await queryInterface.renameColumn('users', 'name', 'fullName')

    // 2. Add username
    await queryInterface.addColumn('users', 'username', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    })
  },

  async down(queryInterface, Sequelize) {
    // rollback username
    await queryInterface.removeColumn('users', 'username')

    // rollback fullName -> name
    await queryInterface.renameColumn('users', 'fullName', 'name')
  }
}
