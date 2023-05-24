module.exports = app => {
    const dash_path = require("../controllers/file_controllers");
    
      var router = require("express").Router();
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
  
router.get("/", dash_path.findAll);
router.get("/chatbot", dash_path.chatbot);
router.post("/save_chatbot",upload.single('response'), dash_path.save_chatbot);
router.get("/dash_index", dash_path.get_index);
router.get("/help", dash_path.help);
router.get("/login", dash_path.getlogin);
router.get("/aboutus", dash_path.aboutus);
router.get("/contactus", dash_path.contactus);
router.get("/contact_details", dash_path.contact_details);
router.get("/registration_details", dash_path.registration_details);
router.get("/services", dash_path.services);
router.get("/termsandconditions", dash_path.termsandconditions);
router.get("/blog", dash_path.blog);
router.post("/save_contact", dash_path.save_contact);
router.post("/save_partner", dash_path.save_partner);
router.get("/registration_recruitment_partner", dash_path.registration_recruitment_partner);
router.post("/verify_details", dash_path.verify_details);
router.post("/verify_details2", dash_path.verify_details2);
router.post("/verify_otp", dash_path.verify_otp);
router.post("/verify_otp2", dash_path.verify_otp2);
router.get("/register", dash_path.getregister);
router.get("/view_admins", dash_path.view_admin);
router.get("/view_subadmins", dash_path.view_subadmin);
router.get("/view_job_seekers", dash_path.view_job_seekers);
router.get("/add_job_seekers", dash_path.add_job_seekers);
router.get("/edit_job_seeker", dash_path.edit_job_seeker);
router.get("/view_job_detail", dash_path.view_job_detail);
router.get("/view_feedbacks", dash_path.view_feedbacks);
router.get("/edit_details", dash_path.edit_details);
router.get("/view_details", dash_path.view_details);
router.get("/add_feedback", dash_path.add_feedback);
router.post("/update_ques", dash_path.update_ques);
router.post("/save_ques", dash_path.save_ques);
router.post("/save_feedback", dash_path.save_feedback);
router.get("/view_ques", dash_path.view_ques);
router.get("/add_ques", dash_path.add_ques);
router.get("/edit_ques", dash_path.edit_ques);
router.get("/add_admin", dash_path.add_admin);
router.post("/save_admin", dash_path.save_admin); 
router.get("/add_subadmin", dash_path.add_subadmin);
router.post("/save_subadmin", dash_path.save_subadmin);
router.post("/save_job_seekers",upload.fields([{ name: 'photo' }, { name: 'resume' }]), dash_path.save_job_seekers);
router.get("/delete_admin/:id", dash_path.admin_delete);
router.get("/delete_subadmin/:id", dash_path.subadmin_delete);
router.get("/delete_job_seeker/:id", dash_path.job_seeker_delete);
router.get("/error-404", dash_path.get404);
router.get("/error-500", dash_path.get500);
router.post("/login",dash_path.postlogin);
router.get("/logout", dash_path.get_logout);

router.get("/download_resume", dash_path.download_resume);

router.get("/verify_job_seeker", dash_path.verify_job_seeker);
router.get("/verify_job_seeker2", dash_path.verify_job_seeker2);

router.get("/export_admins", dash_path.csv_admin);
router.get("/export_subadmins", dash_path.csv_subadmin);
router.get("/export_job_seekers", dash_path.csv_job_seekers);
router.get("/export_feedbacks", dash_path.csv_feedbacks);
router.get("/export_ques", dash_path.csv_ques);
//      
//     router.post("/editor_master", dash_path.add_editor);
//     router.post("/add_blog",upload.single('pic'), dash_path.add_blog);
//     // Retrieve all dash_path
    
//     // Retrieve all published dash_path 
//     router.post("/", dash_path.findAllPublished);
   
//     // Retrieve a single Tutorial with id
//     router.get("/blog_single/:id", dash_path.findOne);
//     router.get("/blog_update/:id", dash_path.blog_update);

    
//     router.get("/blog_master", dash_path.get_blogm);
  
//     router.get("/editor_master", dash_path.get_editorm);
//     router.get("/admin_master", dash_path.get_adminm);

//     router.get("/dash_index", dash_path.get_index);
//     // router.get("/dash_index2", dash_path.get_index2); 

//     router.get("/blog_editor", dash_path.get_editor);
   
//     router.get("/blog_viewer", dash_path.get_viewer);


    
   
//     // Update a Tutorial with id
//     router.post("/blog_update",upload.single('pic'), dash_path.update_blog);
  
//     // Delete a Tutorial with id
//     router.get("/delete_blog/:id", dash_path.blog_delete);
//     router.get("/delete_editor/:id", dash_path.editor_delete);
//   
  
//     // Create a new Tutorial
    // router.delete("/", dash_path.deleteAll);

    app.use('/', router);
  };