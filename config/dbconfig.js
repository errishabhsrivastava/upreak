const Sequelize = require('sequelize');

const sequelize = new Sequelize('Blogs','postgres','rish',{
    host: 'localhost',
    dialect: 'postgres'
});

try{
    sequelize.authenticate();
    console.log("connection done");
}catch(error){
    console.log("not done",error);
}

const db={};
db.Sequelize=Sequelize;
db.sequelize=sequelize; 

db.user = require("../models/LoginModel")(sequelize,Sequelize.DataTypes);
db.mainquery = require("../models/mainModel")(sequelize,Sequelize.DataTypes); 
db.feedback = require("../models/feedbackModel")(sequelize,Sequelize.DataTypes); 
db.questions = require("../models/questionModel")(sequelize,Sequelize.DataTypes); 
db.responses= require("../models/responseModel")(sequelize,Sequelize.DataTypes); 
db.partner_registration= require("../models/partnerModel")(sequelize,Sequelize.DataTypes); 
db.contactus= require("../models/contactModel")(sequelize,Sequelize.DataTypes); 
    // db.user.hasMany(db.responses,{foreignKey:'email'})
    // db.responses.belongsTo(db.user, { foreignKey: 'emailid' });

// db.questions.hasMany(db.responses, { foreignKey: 'question_id' });
// db.responses.belongsTo(db.questions, { foreignKey: 'id' });

db.sequelize.sync({force:false}).then(() =>{
    console.log("Resync is done");
});

module.exports = db;