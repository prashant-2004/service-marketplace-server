// import { initializeApp } from "firebase/app";
// const firebaseConfig = {
//   apiKey: "AIzaSyAswiZhRb57YYPR51gkL6V81ZwCH5Z_sNw",
//   authDomain: "service-marketplace-send-4280e.firebaseapp.com",
//   projectId: "service-marketplace-send-4280e",
//   storageBucket: "service-marketplace-send-4280e.appspot.com",
//   messagingSenderId: "850116010909",
//   appId: "1:850116010909:web:ae50c7b1f98a1f7856c574"
// };

// const app = initializeApp(firebaseConfig);

require("dotenv").config();
const express = require("express");
const router = new express.Router();
const nodemailer = require("nodemailer");

router.post("/sendemail",(req,res)=>{
  const email = req.body.email;
  console.log(email);
  try{
      const transporter = nodemailer.createTransport({
        service:"gmail",
        auth:{
          user:process.env.EMAIL,
          pass:process.env.PASSWORD
        }
      });

      const mailOptions = {
        from : process.env.EMAIL,
        to : email,
        subject : "Sending Email",
        html:'<h1>EMAIL SENT SUCCESSFULLLY..</h1>'
      }

      transporter.sendMail(mailOptions,(error,info)=>{
        if(error){
          console.log("ERROR : ",error);
        }
        else{
          console.log("EMAIL SENT "+info.response);
          res.status(201).json({status:201, info})
        }
      })
  }
  catch(error){
    res.status(201).json({status:401, error});
  }
})


module.exports = router;