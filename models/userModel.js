module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: 'users'
  });
  // Definisikan asosiasi User dengan Post dan Comment

User.associate = (models) => {
  User.hasMany(models.Post, { foreignKey: 'userId' });
  User.hasMany(models.Comment, { foreignKey: 'userId' });
  User.belongsToMany(models.User, {
    through: models.Relationship,
    as: 'Follower',
    foreignKey: 'followingId',
    otherKey: 'followerId',
  });
  User.belongsToMany(models.User, {
    through: models.Relationship,
    as: 'Following',
    foreignKey: 'followerId',
    otherKey: 'followingId',
  });
};

  return User;
}



// module.exports = User;
