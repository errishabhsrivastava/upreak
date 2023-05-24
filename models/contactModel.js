module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define( "contactus", {
      name: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      email: {
          type: DataTypes.STRING,
          isEmail: true,
          allowNull: false,
      },
      subject: { 
          type: DataTypes.STRING,
          allowNull: false,
      },
      message: { 
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
  return Contact;
};