module.exports = (sequelize, DataTypes) => {
  const Partner = sequelize.define( "partner_registration", {
      name: {
          type: DataTypes.STRING,
          allowNull: false,
      },
      email: {
          type: DataTypes.STRING,
          isEmail: true,
          allowNull: false,
      },
      number: { 
          type: DataTypes.STRING,
          allowNull: false,
      },
      city: { 
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
  return Partner;
};