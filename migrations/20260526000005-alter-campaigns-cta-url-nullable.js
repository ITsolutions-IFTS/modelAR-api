const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface) {
    await queryInterface.changeColumn('campaigns', 'cta_url', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.changeColumn('campaigns', 'cta_url', {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '',
    });
  },
};
