'use strict';
module.exports = (sequelize, DataTypes) => {
  const Restaurant = sequelize.define('Restaurant', {
    name: DataTypes.STRING,
    tel: DataTypes.STRING,
    address: DataTypes.STRING,
    opening_hours: DataTypes.STRING,
    description: DataTypes.TEXT,
    image: DataTypes.STRING,
    viewCounts: DataTypes.INTEGER
  }, {});
  Restaurant.associate = function(models) {
    Restaurant.belongsTo(models.Category)// associations can be defined here
    Restaurant.hasMany(models.Comment)
  };
  return Restaurant;
};