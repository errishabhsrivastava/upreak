module.exports = (sequelize, DataTypes) => {
  const ViewerResponse = sequelize.define( "responses", {
      // question_id: { 
      //     type: DataTypes.INTEGER,
      //     allowNull: true,
      // }, 
phonenumber: { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
application_id: { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
verification: { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
whatsappnumber: { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
  name: { 
    type: DataTypes.STRING,
    allowNull: true,
}, 
emailid: { 
  type: DataTypes.STRING,
  allowNull: true,
  unique: true,
  isEmail: true,
},
marragestatus:  { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
area:  { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
city:  { 
  type: DataTypes.STRING,
  allowNull: true,
},
pincode:  { 
  type: DataTypes.STRING,
  allowNull: true,
},
hometown:  { 
  type: DataTypes.STRING,
  allowNull: true,
},
languages:  { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
highesteducation:  { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
coursetype: { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
enteruniversity: { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
namecollege: { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
namecity: { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
urole: { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
coursename: { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
skills: { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
jobtype: { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
project_name: { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
period: { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
project_role_summary: { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
company_name: { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
position: { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
experience: { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
typeofjob: { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
cities_work_in: { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
industry_excites: { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
job_role_looking: { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
favourite_department: { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
preferred_designation: { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
preferred_ctc: { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
present_ctc: { 
  type: DataTypes.STRING,
  allowNull: true,
},
job_type: { 
  type: DataTypes.STRING,
  allowNull: true,
},
notice_period: { 
  type: DataTypes.STRING,
  allowNull: true,
},
upload_photo:{ 
  type: DataTypes.BLOB,
  allowNull: true,
},
referee_name: { 
  type: DataTypes.STRING,
  allowNull: true,
},
referee_contact_no: { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
referee_whatsapp_number: { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
referee_mail_id: { 
  type: DataTypes.STRING,
  allowNull: true,
},
payment_upi_id : { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
resume_file:{ 
  type: DataTypes.BLOB,
  allowNull: true,
},
dob: { 
 type: DataTypes.STRING,
 allowNull: true,
}, 
password: { 
  type: DataTypes.STRING,
  allowNull: true,
}, 
gender: { 
  type: DataTypes.STRING,
  allowNull: true,
 }, 
alldata: { 
  type: DataTypes.JSON,
  allowNull: true,
}, 
id: {
  type: DataTypes.INTEGER,
  autoIncrement: true,
  primaryKey: true,
  allowNull: false, 
}, 
createdAt: {
  allowNull: true,
  type: DataTypes.DATEONLY,
  defaultValue: DataTypes.NOW,
},
updatedAt: {
  allowNull: true,
  type: DataTypes.DATEONLY,
},
  }, {timestamps:false} );
  return ViewerResponse;
};