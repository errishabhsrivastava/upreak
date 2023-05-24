module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define( "dashlogins", {
      username: {
          unique: true,
          type: DataTypes.STRING,
          allowNull: false,
      },
      email: {
          type: DataTypes.STRING,
          unique: true,
          isEmail: true,
          allowNull: false,
      },
      password: { 
          type: DataTypes.STRING,
          allowNull: false,
      }, 
      createdby: { 
          type: DataTypes.STRING,
          allowNull: false,
      }, 
      role: { 
          type: DataTypes.STRING,
          allowNull: false, 
      },
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false, 
  }, 
  createdAt: {
    allowNull: false,
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    allowNull: true,
    type: DataTypes.DATEONLY,
  },
  }, {timestamps:false} );
  return User;
};