/* eslint-disable no-unused-vars */
'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Relationship extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Relationship.belongsTo(models.User, {
        as: 'Follower',
        foreignKey: 'followerId',
      });
      Relationship.belongsTo(models.User, {
        as: 'Following',
        foreignKey: 'followingId',
      });
    }
  }
  Relationship.init({
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key:'id'
      }
    },
    followingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Relationship',
    tableName:'relationships'
  });
  return Relationship;
};
