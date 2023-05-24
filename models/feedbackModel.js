module.exports = (sequelize, DataTypes) => {
  const ViewerFeedback = sequelize.define( "viewerfeedback", {
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
     title: { 
          type: DataTypes.STRING,
          allowNull: true,
      },
      description: { 
        type: DataTypes.STRING,
        allowNull: true,
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
  return ViewerFeedback;
};