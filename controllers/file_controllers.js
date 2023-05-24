const db = require("../config/dbconfig");
const { createObjectCsvWriter } = require('csv-writer');
const fs = require('fs');
const json2csv = require('json2csv');
const { where } = require("sequelize");
const alert = require("alert");
var nodemailer = require('nodemailer');
const readline = require('readline');
const multer = require("multer");
const storage= multer.diskStorage({
  destination:function(req,file,cb){
     cb(null,'uploads/')
  },
  filename:function(req,file,cb){
    cb(null, file.originalname)
  }
})
const upload = multer({ storage:storage});

const ContactUs = db.contactus;
const Partner = db.partner_registration;
const Feedback = db.feedback;
const User = db.user;
const MainQuery = db.mainquery;
const Question = db.questions;
const Response = db.responses;


const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey('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');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const sendTestEmail = async (recipientEmail, message) => {
  const html = `
    <html>
      <head>
        <style>
          /* Define your custom CSS styles here */
          body {
            font-family: Arial, sans-serif;
          }
          a{
            color:#fff;
          }
          .container {
            background-color: #f7f7f7;
            padding: 20px;
            border-radius: 5px;
          }
          .title {
            color: #333;
            font-size: 24px;
            margin-bottom: 10px;
          }
          .message {
            color: #555;
            font-size: 16px;
            margin-bottom: 20px;
          }
          .button {
            background-color: #007bff;
            color: #fff;
            padding: 10px 20px;
            border-radius: 3px;
            text-decoration: none;
          }
        </style>
      </head>
      <body>
        <div class="container card text-center text-white">
          <h2 class="title">Welcome to Upreak</h2>
          <p class="message">${message}</p>
        <a href="https://www.upreak.com" class="button text-white">Visit Upreak</a>
        </div>
      </body>
    </html>
  `;

  const msg = {
    to: recipientEmail,
    from: 'ersrivastavadeveloper@gmail.com',
    subject: 'Test Email',
    html: html,
  };

  try {
    await sgMail.send(msg);
    console.log('Test email sent successfully!');
  } catch (error) {
    console.error('Error sending test email:', error);
  }
};

// Example usage



const accountSid = 'AC0708454525c09404a68b192bdc9bb615';
const authToken = '687b9acd6c07cc8158be1d7f9d6dd6a8';
const client = require('twilio')(accountSid, authToken);



function generateOTP() {
  // Generate a 6-digit random number as the OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function sendOTP(phoneNumber, otp) {
  return client.messages.create({
    body: `Your OTP is: ${otp}`,
    from: '+12707478268',
    to: phoneNumber,
  });
}

function verifyOTP(userOTP, storedOTP) {
  // Compare the user-entered OTP with the stored OTP
  return userOTP === storedOTP;
}


const sendVerificationEmail = async (recipientEmail, otp) => {
  const msg = {
    to: recipientEmail,
    from: 'ersrivastavadeveloper@gmail.com',
    subject: 'OTP Verification',
    text: `Your OTP is: ${otp}`,
  };

  try {
    await sgMail.send(msg);
    console.log('Verification email sent successfully!');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};

const sendVerificationSuccessEmail = async (recipientEmail) => {
  const msg = {
    to: recipientEmail,
    from: 'ersrivastavadeveloper@gmail.com',
    subject: 'Verification Successful',
    text: 'Your OTP verification was successful. Thank you!',
  };

  try {
    await sgMail.send(msg);
    console.log('Verification success email sent successfully!');
  } catch (error) {
    console.error('Error sending verification success email:', error);
  }
};

const sendVerificationFailureEmail = async (recipientEmail) => {
  const msg = {
    to: recipientEmail,
    from: 'ersrivastavadeveloper@gmail.com',
    subject: 'Verification Failed',
    text: 'Your OTP verification failed. Please try again.',
  };

  try {
    await sgMail.send(msg);
    console.log('Verification failure email sent successfully!');
  } catch (error) {
    console.error('Error sending verification failure email:', error);
  }
};

const verifyOTP2 = (userOTP, storedOTP, recipientEmail) => {
  // Compare the user-entered OTP with the stored OTP
  const isVerified = userOTP === storedOTP;

  if (isVerified) {
    sendVerificationSuccessEmail(recipientEmail);
  } else {
    sendVerificationFailureEmail(recipientEmail);
  }

  return isVerified;
};

exports.download_resume= async(req, res) => {
  const id = req.query.id;
 let data= await Response.findByPk(id)
  if(data.resume_file){
  const filePath = 'uploads/'+data.resume_file;
  const fileName = data.resume_file;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

  // Stream the file content to the response
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
  }
  else{
    res.render('view_job_seekers');
  }

  
};

exports.chatbot = async (req, res) => {
  try {
    const questions = await Question.findAll({ order: [['id', 'ASC']] });
    const firstQuestion = questions.shift();
    const chatHistory = [];
    const user_resp=[];
    res.render('chatbot', { question: firstQuestion, questions, chatHistory,user_resp });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};
var i=0;
exports.save_chatbot = (upload.single('response'), async (req, res) => {
  try {
    const questionId = req.body.question_id;
    const response = req.body.response;
    
    const questions = await Question.findAll({ order: [['id', 'ASC']] });
    const currentQuestionIndex = questions.findIndex((question) => question.id === parseInt(questionId));
    const nextQuestion = questions[currentQuestionIndex + 1];
    const user_resp=req.body.user_resp ? JSON.parse(req.body.user_resp) : [];
    const previousQuestion = req.body.previous_question;
    const previousResponse = req.body.previous_response;
    const chatHistory = req.body.chat_history ? JSON.parse(req.body.chat_history) : [];
    if (previousQuestion) {
      chatHistory.push({ type: 'question', text: previousQuestion });
      chatHistory.push({ type: 'response', text: previousResponse });
      // user_resp.push({ questionId,previousResponse });
    }
   
    const currentQuestion = await Question.findByPk(questionId);
    const chatEntry = { type: 'question', text: currentQuestion.question };
    chatHistory.push(chatEntry);
    chatHistory.push({ type: 'response', questionId:questionId,text: response });
    user_resp.push({ questionId, response });

    if (nextQuestion) {
      res.render('chatbot', { question: nextQuestion, questions, chatHistory,user_resp });
    } else {
      console.log(user_resp);
      i=i+1;
      await Response.create({
        alldata:user_resp,
        phonenumber:user_resp[0].response,
        whatsappnumber:user_resp[1].response,
        name:user_resp[2].response,
        emailid:user_resp[3].response,
        dob:user_resp[4].response,
        password:user_resp[5].response,
        resume_file:req.file.filename,
        // application_id:'UP1000'+ i,
        urole:'User' });
        
      let data=  await Response.findOne({where:{emailid:user_resp[3].response}});
        await Response.update({
          application_id:'UP1000'+data.id,
        },{
          where:{emailid:user_resp[3].response}
            });
        await User.create({
          username:user_resp[2].response,
          email:user_resp[3].response,
          password:user_resp[5].response,
          role:'User',
        createdby:'User' });
        
    
      const thankYouMessage = "Thank You";
      chatHistory.push({ type: 'question', text: thankYouMessage });
      console.log(chatHistory);
      console.log("------------");
      console.log(user_resp[0].response);
      console.log("------------");
      const recipientEmail = user_resp[3].response;
      const message = 'Thank you for your interest in Upreak Company. <br>We are excited to have you on board.';
      sendTestEmail(recipientEmail, message);
      res.render('index', { question: null, questions, chatHistory,user_resp });
    }
  } catch (error) {
    console.error(error);
    res.render('error-500');
  }
});

exports.verify_job_seeker = (req, res) => { 
  if(session.role == 'Master' || session.role == 'Admin'  || session.role == 'User' ){
    res.render('verify_job_seeker',{ otpSent: false, verified: false, otp: null });
  }else
   res.redirect("login");

};
exports.verify_job_seeker2 = (req, res) => { 
  if(session.role == 'Master' || session.role == 'Admin'  || session.role == 'User' ){
    res.render('verify_job_seeker2',{ email: '', otpSent: false, verified: false });
  }else
   res.redirect("login");

};
exports.verify_details = (req, res) => {
 
  const phoneNumber = req.body.phoneNumber;
  const otp = generateOTP();
    console.log('Generated OTP:', otp);

  sendOTP(phoneNumber, otp)
    .then(message => {
      console.log('OTP sent successfully:', message.sid);
     
      res.render('verify_job_seeker', { otpSent: true, verified: false, otp: otp });
    })
    .catch(error => {
      console.error('Error sending OTP:', error);
      res.render('verify_job_seeker', { otpSent: false, verified: false, otp: null });
    });
};
exports.verify_otp = (req, res) => {
  const userEnteredOTP = req.body.otp;
  const storedOTP = req.body.storedOTP;

  if (verifyOTP(userEnteredOTP, storedOTP)) {
    console.log('OTP verification successful!');
    // Send alert to the user
  
    res.render('verify_job_seeker', { otpSent: true, verified: true, otp: storedOTP });
  } else {
    console.log('OTP verification failed!');
    // Send alert to the user
    sendAlert('+917037564392', 'OTP verification failed!');
    res.render('verify_job_seeker', { otpSent: true, verified: false, otp: storedOTP });
  }

  function sendAlert(phoneNumber, message) {
    client.messages.create({
      body: message,
      from: '+12707478268',
      to: phoneNumber,
    })
    .then(message => {
      console.log('Alert message sent successfully:', message.sid);
    })
    .catch(error => {
      console.error('Error sending alert message:', error);
    });
  }
  
};

exports.verify_details2 = (req, res) => {
  const recipientEmail = req.body.email;
  const otp = generateOTP();

  sendVerificationEmail(recipientEmail, otp)
    .then(() => {
        res.render('verify_job_seeker2', { email: recipientEmail, otp: otp, otpSent: true, verified: false });
    })
    .catch((error) => {
      console.error('Error sending verification email:', error);
      res.render('verify_job_seeker2', { email: '', otpSent: false, verified: false });
    });
};
exports.verify_otp2 = (req, res) => {
  const userEnteredOTP = req.body.otp;
  const recipientEmail = req.body.email;
  const storedOTP = req.body.storedOTP;

  if (verifyOTP2(userEnteredOTP, storedOTP, recipientEmail)) {
    res.render('verify_job_seeker2', { email: recipientEmail, otp: storedOTP, otpSent: true, verified: true });
  } else {
    res.render('verify_job_seeker2', { email: recipientEmail, otp: storedOTP, otpSent: true, verified: false });

  }
};
exports.findAll = (req, res) => { 
        res.render('index');
};

exports.getlogin = (req, res) => {
          res.render('login');
};
exports.blog = (req, res) => {
  res.render('blog');
};
exports.save_contact = (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    message:req.body.message,
  };
  ContactUs.create(data)
  .then(data => {
    alert("Thank You!");
    res.redirect('contactus');
  })
  .catch(err => {
    res.redirect("/error-500");
  });
 
};
exports.save_partner = (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    number: req.body.number,
    city:req.body.city,
  };

  Partner.create(data)
  .then(data => {
  alert("Thank You for Registration!");
    res.redirect('registration_recruitment_partner');
  })
  .catch(err => {
    res.redirect("/error-500");
  });
 
};
exports.registration_recruitment_partner = (req, res) => {
    res.render('registration_recruitment_partner');
};
exports.aboutus = (req, res) => {
  res.render('aboutus');
};
exports.contactus = (req, res) => {
  res.render('contactus');
};
exports.services = (req, res) => {
  res.render('services');
};
exports.termsandconditions = (req, res) => {
  res.render('terms&conditions');
};
exports.getregister = (req, res) => {
  res.render('register');
}; 

exports.get404 = (req, res) => {
  res.render('error-404');
};

exports.get500 = (req, res) => {
  res.render('error-500');
};
  
exports.postlogin= async(req,res) =>{
  try {
    const email = req.body.mail;
    const password = req.body.pswrd;
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
 if (user) {
      const isSame = password  == user.password;
       if (isSame) {
        session=req.session;
        session.userid=req.body.mail;
        session.username=user.username;
        session.role=user.role;
        console.log(req.session)
        return res.redirect("/dash_index");
      }
    } else {
      return res.redirect("/login");
    }
  } catch (error) {
    res.redirect("/error-500");   
  }
};

exports.get_index=(req, res)=> {
      session=req.session;
        if(session.role){
          res.render("dash_index");
      
        }else
        res.redirect("login"); 
    };
    exports.contact_details= (req, res) => {
      session=req.session;
      if(session.role == 'Master' || session.role == 'Admin'){
        ContactUs.findAll()
        .then(data => {
          res.render("contact_details",{locals:data});
        })
        .catch(err => {
          res.redirect("/error-500");
        });
       
      }else
       res.render("login");
      
    };
    exports.registration_details= (req, res) => {
      session=req.session;
      if(session.role == 'Master' || session.role == 'Admin'){
        Partner.findAll()
        .then(data => {
          res.render("registration_details",{locals:data});
        })
        .catch(err => {
          res.redirect("/error-500");
        });
       
       
      }else
       res.render("login");     
      
    };

    exports.help=(req, res)=> {
      session=req.session;
        if(session.role){
          res.render("error-404");
      
        }else
        res.redirect("login"); 
    };
    exports.add_admin = (req, res) => {
  session=req.session;
  if(session.role == 'Master'){
    res.render('add_admins');
  }else
  res.redirect("login");
  
};
exports.add_feedback = (req, res) => {
  session=req.session;
  if(session.role == 'User'){
    res.render('add_feedback');
  }else
  res.redirect("login");
  
};


exports.save_feedback = (req, res) => {
  session=req.session;
  if(session.userid){
    if (!req.body.email || !req.body.password) {
      res.redirect("/error-500");
      return;
    }
    session=req.session;
    // Create a Tutorial:
    const feedback = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      role:req.body.role,
      createdby:session.username,
      
    };
    Feedback.create(feedback)
    .then(data => {
      res.redirect("/dash_index");
      // res.send(data);
      // res.redirect("/admin_master");
    })
    .catch(err => {
      res.redirect("/error-500");
    });
  }else
   res.redirect("login");
    
  };    

exports.save_admin = (req, res) => {
session=req.session;
if(session.userid){
  if (!req.body.email || !req.body.password) {
    res.redirect("/error-500");
    return;
  }
  session=req.session;
  // Create a Tutorial:
  const admin = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role:req.body.role,
    createdby:session.username,
    
  };
  User.create(admin)
  .then(data => {
    res.redirect("view_admins");
    // res.send(data);
    // res.redirect("/admin_master");
  })
  .catch(err => {
    res.redirect("/error-500");
  });
}else
 res.redirect("login");
  
};
exports.view_admin=(req, res) => {
    session=req.session;
    // && session.role== 'admin'where: {role:'admin'  }
    User.findAll({ where: {role:'Admin'  }  })
    .then(data => {
      // && session.role== 'admin'
      if(session.role == 'Master'){
        res.render("view_admins",{
          locals: data
        });
      }
      else
       res.redirect("login");
      })
    .catch(err => {
      res.redirect("/error-500");
  }); 
};
exports.add_subadmin = (req, res) => {
  session=req.session;
  if(session.role == 'Master'){
    res.render('add_subadmins');
  }else
   res.redirect("login");
  
};
    
exports.save_subadmin = (req, res) => {
session=req.session;
if(session.userid){
  if (!req.body.email || !req.body.password) {
    res.redirect("/error-500");
    return;
  }
  session=req.session;
  // Create a Tutorial:
  const admin = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role:req.body.role,
    createdby:session.role,
    
  };
  User.create(admin)
  .then(data => {
    res.redirect("view_subadmins");
    // res.send(data);
    // res.redirect("/admin_master");
  })
  .catch(err => {
    res.redirect("/error-500");
  });
}else
 res.redirect("login");
  
};
exports.view_subadmin=(req, res) => {
    session=req.session;
    // && session.role== 'admin'where: {role:'admin'  }
    User.findAll({ where: {role:'SubAdmin'  } })
    .then(data => {
      // && session.role== 'admin'
      if(session.role == 'Master'){
        res.render("view_subadmins",{
          locals: data
        });
      }
      else
       res.redirect("login");
      })
    .catch(err => {
      res.redirect("/error-500");
  }); 
};
exports.add_job_seekers = (req, res) => {
  session=req.session;
  if(session.role == 'Master' || session.role == 'Admin'  || session.role == 'User' ){
    res.render('add_job_seekers',{locals:undefined,recordType:'new', ViewUser:'add'});
  }else
   res.redirect("login");
  
};
exports.add_ques= (req, res) => {
  session=req.session;
  if(session.role == 'Master' || session.role == 'Admin'){
    res.render('add_questions',{locals:undefined,recordType:'new'});
  }else
   res.redirect("login");
  
};
exports.view_job_seekers=(req, res) => {
  session=req.session;
  // && session.role== 'admin'where: {role:'admin'  }
  Response.findAll({  })
  .then(data => {
    // && session.role== 'admin'
    if(session.role == 'Master' || session.role == 'Admin' || session.role == 'SubAdmin'){
      res.render("view_job_seekers",{
        locals: data,
        srole:session.role,
        ViewUser:'view'
      });
    }
    else
     res.redirect("login");
    })
  .catch(err => {
    res.redirect("/error-500");
}); 
};
exports.edit_job_seeker = (req, res) => {
  const id = req.query.id;
  session=req.session;
  if(session.role == 'Master' ||  session.role == 'Admin' ||  session.role == 'User'){
 Response.findByPk(id) 
    .then(data => {
      if (data) {
        res.render('add_job_seekers',{ 
          locals: data,
          recordType:'exsist',
          ViewUser:'edit'
        });
      } else {
         res.redirect("login");
      }
    })
    .catch(err => {
       res.redirect("login");
    }); }else{
     res.redirect("login");
    }
};
exports.edit_details = (req, res) => {

  session=req.session;
  const email=session.userid;
  if( session.role =='User'){
    Response.findOne({where:{emailid:email}}) 
      .then(data => {
          res.render('add_job_seekers',{ 
            locals: data,
            recordType:'exsist',
            ViewUser:'edit'
          });
       })
      .catch(err => {
         res.redirect("login");
      }); }else{
       res.redirect("login");
      }
};
exports.view_job_detail=(req, res) => {
  session=req.session;
  const id= req.query.id;
  if( session.role == 'Master' || session.role == 'Admin'  || session.role == 'SubAdmin'){
    Response.findByPk(id)
      .then(data => {
          res.render('add_job_seekers',{ 
            locals: data,
            ViewUser:'view'
          });
       })
      .catch(err => {
         res.redirect("login");
      }); }else{
       res.redirect("login");
      } 
};
exports.view_details=(req, res) => {
  session=req.session;
  const email=session.userid;
  if( session.role =='User'){
    Response.findOne({where:{emailid:email}}) 
      .then(data => {
          res.render('add_job_seekers',{ 
            locals: data,
            ViewUser:'view'
          });
       })
      .catch(err => {
         res.redirect("login");
      }); }else{
       res.redirect("login");
      } 
};
exports.save_job_seekers = (upload.fields([{ name: 'photo' }, { name: 'resume' }]),function(req, res,next) {
  session=req.session;
  if(req.files['photo']){
  var imageFile = req.files['photo'][0];
}else{
  var imageFile =  req.body.photo_file_name;
}
if(req.files['resume']){
  var pdfFile = req.files['resume'][0];
}else{
  var pdfFile  =  req.body.resume_file_name;
}
  
  if(session.role == 'Master' || session.role == 'Admin'  || session.role == 'User'){
    const data = {
      name: req.body.name,
      emailid: req.body.email,
      password: req.body.password,
      phonenumber:req.body.phonenumber,
      whatsappnumber:req.body.whatsappnumber,
      area:req.body.area,
      city:req.body.city,
      state:req.body.state,
      pincode:req.body.pincode,
      gender:req.body.gender,
      marragestatus:req.body.maritalstatus,
      upload_photo:imageFile.filename,
      resume_file:pdfFile.filename,
       };
    if(!(Response.findOne({where:{emailid:req.body.email}}))){
    // Create a Tutorial:
     Response.create(data)
    .then(data => {
      res.redirect("view_job_seekers");

    })
    .catch(err => {
      res.redirect("/error-500");
    });
    }
  else{
    Response.update(data, {
      where:{emailid:req.body.email}
        })
          .then(data=> {
            if(!(session.role === 'User')){
              res.redirect("view_job_seekers");
            }else{
              res.redirect("view_details");
            }  

                 })
          .catch(err => {
            res.status(500).send({
              message: "Error updating job seekers with id=" + id
            });
          });
  }
}  
  else
  res.redirect("login");
  });
  exports.edit_ques = (req, res) => {
    const id = req.query.id;
    session=req.session;
    if(session.role == 'Master' || session.role == 'Admin'){
   Question.findByPk(id) 
      .then(data => {
        if (data) {
          res.render('add_questions',{ 
            locals: data
          });
        } else {
           res.redirect("login");
        }
      })
      .catch(err => {
         res.redirect("login");
      }); }else{
       res.redirect("login");
      }
  };
  exports.save_ques = (req, res) => {
    session=req.session;
    if(session.role == 'Master' || session.role == 'Admin'){
      const data = {
        question:req.body.question,
        type:req.body.type        
      };
      if(!req.query.id){
      // Create a Tutorial:
       Question.create(data)
      .then(data => {
        res.redirect("view_ques");
  
      })
      .catch(err => {
        res.redirect("/error-500");
      });
      }
    else{
      Question.update(data, {
            where: { id: req.query.id
             }
          })
            .then(data=> {
              res.redirect("view_ques");
                   })
            .catch(err => {
              res.status(500).send({
                message: "Error updating question with id=" + id
              });
            });
    }
  }  
    else
    res.redirect("login");
    };
    exports.update_ques = (req, res) => {
      session=req.session;
      if(session.role == 'Master' || session.role == 'Admin'){
        const id= req.body.id;
        const data = {
          question:req.body.question,
          type:req.body.type        
        };
      
        Question.update(data, {
              where: { id: id,
               }
            })
              .then(data=> {
                res.redirect("view_ques");
                     })
              .catch(err => {
                res.status(500).send({
                  message: "Error updating question with id=" + id
                });
              });
            }
      };
exports.view_feedbacks=(req, res) => {
  session=req.session;
  // && session.role== 'admin'where: {role:'admin'  }
  Feedback.findAll({  })
  .then(data => {
    // && session.role== 'admin'
    if(session.role == 'Master' || session.role == 'Admin' || session.role == 'SubAdmin'){
      res.render("view_feedbacks",{
        locals: data
      });
    }
    else
     res.redirect("login");
    })
  .catch(err => {
    res.redirect("/error-500");
}); 
};
exports.save_feedback= (req, res) => {
  session=req.session;
  if(session.role == 'User'){
    const data = {
      username:session.username,
      email:session.userid,
      title:req.body.title,
      description:req.body.description,
    };
   
     Feedback.create(data)
    .then(data => {
      res.redirect("dash_index");
    })
    .catch(err => {
      res.redirect("/error-500");
    });
}  
  else
  res.redirect("login");
  };
exports.view_ques=(req, res) => {
  session=req.session;
  // && session.role== 'admin'where: {role:'admin'  }
  Question.findAll({  })
  .then(data => {
    // && session.role== 'admin'
    if(session.role == 'Master' || session.role == 'Admin' || session.role == 'SubAdmin'){
      res.render("view_questions",{
        locals: data,
        srole:session.role
      });
    }
    else
     res.redirect("login");
    })
  .catch(err => {
    res.redirect("/error-500");
}); 
};
exports.admin_delete = (req, res) => {
    const id = req.params.id;
  
    User.destroy({
      where: { id:id }
    })
      .then(User => {
          res.redirect("/view_admins");
          // res.render('dash_index');     
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete admin with id=" + id
        });
      });
};
exports.subadmin_delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id:id }
  })
    .then(User => {
        res.redirect("/view_subadmins");
        // res.render('dash_index');     
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete admin with id=" + id
      });
    });
};
exports.job_seeker_delete = async(req, res) => {

  if(session.role == 'Master'){
    const id = req.params.id;
Response.destroy({
    where: { id:id }
  })
    .   then(User => {
        res.redirect("/view_job_seekers");
        // res.render('dash_index');     
    })
    .catch(err => {
      res.redirect("/error-404");
    });
  }else{
    res.redirect("login");
  }
};
exports.get_logout=(req,res) => {
      req.session.destroy();
      res.redirect('login');
};

exports.csv_admin = (req, res) => {
  
  try{
    var query = `SELECT * FROM dashlogins WHERE role='Admin'`;
    var filename = 'admin_list.csv';
    MainQuery.execQuery(query, function (err, data) {
      if (err) {
        res.send(err);
      } else {
        var docs = data;
        let fields = Object.keys(docs[0]);
        let fieldNames = Object.keys(docs[0]);
        fieldNames.forEach((val, idx) => {        
          fieldNames[idx] = val.toUpperCase();
        });
        data = json2csv({
          data: docs,
          fields: fields,
          fieldNames: fieldNames
        });
        res.attachment(filename);
        res.status(200).send(data);
      }
    });
  }catch(e){
    console.log('ERROR');
  }
};
exports.csv_subadmin = (req, res) => {
  
  try{
    var query = `SELECT * FROM dashlogins WHERE role='SubAdmin'`;
    var filename = 'subadmin_list.csv';
    MainQuery.execQuery(query, function (err, data) {
      if (err) {
        res.send(err);
      } else {
        var docs = data;
        let fields = Object.keys(docs[0]);
        let fieldNames = Object.keys(docs[0]);
        fieldNames.forEach((val, idx) => {        
          fieldNames[idx] = val.toUpperCase();
        });
        data = json2csv({
          data: docs,
          fields: fields,
          fieldNames: fieldNames
        });
        res.attachment(filename);
        res.status(200).send(data);
      }
    });
  }catch(e){
    console.log('ERROR');
  }
};
exports.csv_job_seekers = async(req, res) => {
  try{
    var query = `SELECT * FROM responses WHERE role='User'`;
    var filename = 'job_seekers_list.csv';
    MainQuery.execQuery(query, function (err, data) {
      if (err) {
        res.send(err);
      } else {
        var docs = data;
        let fields = Object.keys(docs[0]);
        let fieldNames = Object.keys(docs[0]);
        fieldNames.forEach((val, idx) => {        
          fieldNames[idx] = val.toUpperCase();
        });
        data = json2csv({
          data: docs,
          fields: fields,
          fieldNames: fieldNames
        });
        res.attachment(filename);
        res.status(200).send(data);
      }
    });
  }catch(e){
    console.log('ERROR');
  }
};
exports.csv_feedbacks = async(req, res) => {
  try{
    var query = `SELECT * FROM viewerfeedbacks`;
    var filename = 'feedback_list.csv';
    MainQuery.execQuery(query, function (err, data) {
      if (err) {
        res.send(err);
      } else {
        var docs = data;
        let fields = Object.keys(docs[0]);
        let fieldNames = Object.keys(docs[0]);
        fieldNames.forEach((val, idx) => {        
          fieldNames[idx] = val.toUpperCase();
        });
        data = json2csv({
          data: docs,
          fields: fields,
          fieldNames: fieldNames
        });
        res.attachment(filename);
        res.status(200).send(data);
      }
    });
  }catch(e){
    console.log('ERROR');
  }
};
exports.csv_ques = async(req, res) => {
  try{
    var query = `SELECT * FROM questions`;
    var filename = 'question_list.csv';
    MainQuery.execQuery(query, function (err, data) {
      if (err) {
        res.send(err);
      } else {
        var docs = data;
        let fields = Object.keys(docs[0]);
        let fieldNames = Object.keys(docs[0]);
        fieldNames.forEach((val, idx) => {        
          fieldNames[idx] = val.toUpperCase();
        });
        data = json2csv({
          data: docs,
          fields: fields,
          fieldNames: fieldNames
        });
        res.attachment(filename);
        res.status(200).send(data);
      }
    });
  }catch(e){
    console.log('ERROR');
  }
};

// exports.csv_job_seekers = (req, res) => {
//   User.findAll()
//   .then(users => {
//     const csvWriter = createObjectCsvWriter({
//       path: './exported_files/job_seekers_list.csv',
//       header: [
//         { id: 'id', title: 'ID' },
//         { id: 'username', title: 'UserName' },
//         { id: 'email', title: 'Email' },
//         { id: 'password', title: 'Password' },
//         { id: 'role', title: 'Role' },
//         { id: 'createdby', title: 'Created By' },
//         { id: 'createdAt', title: 'Created At' },
//       ]
//     }); 
//     const data = users.map(user => ({
//       id: user.id,
//       username: user.username,
//       email: user.email,
//       password:user.password,
//       role: user.role,
//       createdby:user.createdby,
//       createdAt:user.createdAt
//     }));
//     csvWriter.writeRecords(data)
//     .then(() => {
//       console.log('CSV file created successfully')
//       res.redirect("/view_job_seekers");
//   });
// }).catch(error => console.log(error));
// };

// Create and Save a new Blogs

// exports.add_editor = (req, res) => {
  
//   // Create a Tutorial:
//   session=req.session
//   const editor = {
//     username:req.body.username,
//     email: req.body.email,
//     password: req.body.password,
//     role:'editor',
//     createdby:session.username,
   
//   };
//   console.log(req.body.email,req.body.password);

//   // Save Tutorial in the database
//   User.create(editor)
//     .then(data => {
//       res.send(data);
//       // res.redirect("/editor_master");
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while creating the Tutorial."
//       });
//     });
// };

// exports.add_admin = (req, res) => {
//   console.log(req.body.email,req.body.password);
//   if (!req.body.email || !req.body.password) {
//     res.status(400).send({
//       message: "Content can not be empty!"
//     });
//     return;
//   }
//   session=req.session
//   // Create a Tutorial:
//   const admin = {
//     username: req.body.username,
//     email: req.body.email,
//     password: req.body.password,
//     role:req.body.role,
//     createdby:session.username,
//   };

//   // Save Tutorial in the database
//   User.create(admin)
//     .then(data => {
//       // res.render('dash_index');
//       res.send(data);
//       // res.redirect("/admin_master");
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while creating the Tutorial."
//       });
//     });
// };
// exports.add_blog = (upload.single('pic'),function(req, res,next) {
//   session=req.session;
//   var fileinfo=req.file;
//   // Create a Tutorial:
//   console.log(fileinfo);
    
//   const blog = {
//     username:session.username,
//     title: req.body.title,
//     desc: req.body.desc,
//     pic : fileinfo.filename,
//     dop:req.body.dop,
  
//   }
//   console.log(blog);
//   // Save Tutorial in the database
//   Blogs.create(blog)
//     .then(data => {
      
//       res.redirect("/blog_editor");
//       // res.render('dash_index');
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while creating the Tutorial."
//       });
//     });
// });


// // Find a single Blogs with an id

// exports.blog_update = (req, res) => {
//   session=req.session;
//   const id = req.params.id;
//   console.log(id);
//   // {where:{ id:id }}
//   Blogs.findByPk(id)
//     .then(data => {
//         res.render('blog_update',{
//           locals: data
//         });
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Error retrieving Blogs with id=" + id
//       });
//     });
// };
// // login

//

//   exports.get_blogm =(req, res)  =>{
//     session=req.session;
//     // && session.role== 'admin'
//     Blogs.findAll({ raw: true })
//     .then(data => {
//       if(session.userid && session.role== 'admin'){
//         res.render("blog_master" ,{
//           locals: data
//         });
//       }
//       else
//        res.redirect("login");
//       })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving Blogs."
//       });
//   });

//   };
//   

    
//   };
//   exports.get_editorm=(req, res) => {
//     session=req.session;
//     // && session.role== 'admin'
//     User.findAll({  where: {role:'editor' }})
//     .then(data => {
//       if(session.userid && session.role== 'admin'){
//         res.render("editor_master",{
//           locals: data
//         });
//       }
//       else
//        res.redirect("login");
//       })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving Blogs."
//       });
//   });
    
//   };
//   
//   // exports.get_index2=(req, res)=> {
//   //   session=req.session;
//   //     if(session.userid && session.role== 'editor'){
//   //       res.render("dash_index2");
//   //     }else
//   //      res.redirect("login");
//   // };
//   exports.get_editor=(req, res)=> {
//     session=req.session;
  
//     // && session.role== 'editor'
//     if(session.role== 'editor'){
//     Blogs.findAll({ where:{username:session.username} })
//     .then(data => {

//         res.render("blog_editor" ,{
//           locals: data
//         });
//       })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving Blogs."
//       });
//   });
// }
// else{
//   res.render("login")
// }

//      };
//   exports.get_viewer= (req, res) =>{
//     session=req.session;
  
//     if(session.role== 'editor'){
//       Blogs.findAll({ where:{username:session.username} })
//       .then(data => {
  
//           res.render("blog_viewer" ,{
//             locals: data
//           });
//         })
//       .catch(err => {
//         // res.status(500).send({
//         //   message:
//         //     err.message || "Some error occurred while retrieving Blogs."
//         // });
//          res.redirect("login");
//     });
//   }
//    else if(session.role== 'admin'){
//     Blogs.findAll({ raw: true })
//     .then(data => {
     
//         res.render("blog_viewer" ,{
//           locals: data,
//           role:session.role,
//         });   
//       })
//     .catch(err => {
//        res.redirect("login");
//       // res.status(500).send({
//       //   message:
//       //     err.message || "Some error occurred while retrieving Blogs."
//       // });
//   });
//   }
//   else{
//     res.render("login")
//   }
//     }  
//   

// // Update a Blogs by the id in the request
// exports.update_blog = (upload.single('pic'), (req, res,next) => {
//   const id = req.body.id;
  
//   session=req.session;
  
//   var fileinfo=req.file;
//   console.log(fileinfo);
//   const blog = {

//     title: req.body.title,
//     desc: req.body.desc,
//     dop:req.body.dop,
   
//   };
//   Blogs.update(blog, {
//     where: { id: id }
//   })
//     .then(Blogs=> {
//       // res.render('dash_index');
        
//       res.redirect("/blog_viewer");
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Error updating Blogs with id=" + id
//       });
//     });
// });

// // Delete a Blogs with the specified id in the request
// exports.blog_delete = (req, res) => {
//   const id = req.params.id;

//   Blogs.destroy({
//     where: { id: id }
//   })
//     .then(Blogs => {
//       // res.render('dash_index');
//         if(session.role=="admin")
//         { res.redirect("/blog_master");
//        }else  if(session.role=="editor")
//        { res.redirect("/blog_editor");
//       }  
    
//     })
//     // .then(Blogs => {
      
//     //   res.render('dash_index');
//     // })
//     .catch(err => {
//       res.status(500).send({
//         message: "Could not delete Blogs with id=" + id
//       });
//     });
// };
// exports.editor_delete = (req, res) => {
//   const id = req.params.id;

//   User.destroy({
//     where: { id: id }
//   })
  
//     .then(USer => {
//       res.redirect("/editor_master");
//       // res.render('dash_index');
      
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Could not delete Blogs with id=" + id
//       });
//     });
// };
// 
// // Delete all Blogss from the database.
// exports.deleteAll = (req, res) => {
//   Blogs.destroy({
//     where: {},
//     truncate: false
//   })
//     .then(nums => {
//       res.send({ message: `${nums} Blogss were deleted successfully!` });
//     })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while removing all Blogss."
//       });
//     });
// }; 


// exports.findAllPublished = (req, res) => {
//   // const fdop = req.body.fdop;
//   const fcategory= req.body.fcategory;
//   // Find all published Blogss

//   Blogs.findAll({ where: {
//     // dop : fdop,
//     title : fcategory,
//     } })
//   .then(data => {
//     res.render('index',{
//       locals: data
//     });
//   })
//     .catch(err => {
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while retrieving Blogss."
//       });
//     });
// };

