const express = require("express");
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const bodyParser = require("body-parser");
const ejs = require("ejs");
const request = require("request");
const Sequelize = require("sequelize");
const multer  = require('multer')
const db = require("./config/dbconfig");
const twilio = require('twilio');
const readline = require('readline');



const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use('/uploads',express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

var session;

app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false 
}));

require("./routes/file_route")(app);

let port = process.env.PORT;
if(port == null || port == ""){
    port = 1301;
}
app.listen(port,function(){
    console.log("Server has started on port",port);
});