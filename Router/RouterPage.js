import express from "express";
import {} from 'dotenv/config.js'
import { JobModel, UserModel } from "../Helper/MongooseValidator.js";
import { comparePassword, hashedPassword } from "../Helper/Password.js";
import { generateToken } from "../Helper/Token.js";
import nodemailer from 'nodemailer';
import { isAuth } from "../Helper/isAuth.js";

const router = express.Router();

//Backend Check
router.get('/',(req,res)=>res.status(200).json({message:"Welcome to Chance website"}))

//SignUp route
router.post("/signup",async(req,res)=>{
    try{
        const user = await UserModel.findOne({email:req.body.email});
        if(user){
            return res.status(403).json({message:"User already exist"});
        }
        const hashPin = await hashedPassword(req.body.password);
        const newUser = await UserModel({
            name:req.body.name,
            email:req.body.email,
            qualification:req.body.qualification,
            password:hashPin
        }).save();
        res.status(200).json({message:"New User Added",newUser})
    }
    catch(error){
        console.log("Error",error)
        res.status(500).json({error_message : "Internal server error",message : "Try again later",error})
    }
    
})
//LogIn route
router.post('/login',async(req,res)=>{
    try {
        const user = await UserModel.findOne({email:req.body.email});
        //Checking... user present or not
        if(!user){
            return res.status(403).json({message : "Invalid credential "});
        }
        const verification = await comparePassword(req.body.password,user.password);
        if(!verification){
            return res.status(403).json({message : "Invalid credential "});
        }
        //token generating
        const token = await generateToken(req.body.email);
        res.status(200).json({message:"login success",token,email:user.email});
        
    } catch (error) {
        res.status(500).json({message:"Unable to login...Try Again later",error});
    }
    
});
//Forget password
router.put('/forgetpassword',async(req,res)=>{
    try {
        const user = await UserModel.findOne({email:req.body.email});
        //Checking... user present or not
        if(!user){
            return res.status(403).json({message : "No user found"});
        }
        //token generating
        const token = await generateToken(req.body.email);

        //Mail transporter
        let transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.USER,
                pass:process.env.PASS
            }
        })
        //Message for mail...
        let message = {
            from: 'abdulwasimsguvi@gmail.com',
            to: req.body.email,
            subject: "password reset", 
            html: "<p>Click the below link to reset password</p><br/><b>https://chance-murex.vercel.app/resetpassword</b>", 

        }
        //Sending password reset link mail...
        let sendMail = await transporter.sendMail(message);

        res.status(200).json({message:"Check you mail for reset link success",token,email:user.email});
        
    } catch (error) {
        res.status(500).json({message:"Try Again later",error});
    }
});

//Password reset code for the user....
router.put('/resetpassword',isAuth,async(req,res)=>{
    try {
        const user = await UserModel.findOne({email:req.headers.email});
        //Checking... user present or not
        if(!user){
            return res.status(403).json({message : "No user found"});
        }
        const hashedPin = await hashedPassword(req.body.password);
        const updatedUser = await UserModel.updateOne({email:req.headers.email},{$set:{password:hashedPin}});
        res.status(200).json({message:"password updated"})
    } catch (error) {
        res.status(500).json({message:"Unable to updated password...Try Again later"});
    }
});

//Post job route
router.post('/post-job',isAuth,async(req,res)=>{
    try {
        const user = await UserModel.findOne({email:req.body.email});
        //Checking... user present or not
        if(!user){
            return res.status(403).json({message : "Invalid credential "});
        }
        const newJob = await JobModel({
            email:req.body.email,
            company:req.body.company,
            role :req.body.role,
            skillsRequired : req.body.skillsRequired,
            experience : req.body.experience,
            qualification :req.body.qualification
        }).save();
        res.status(200).json({message:"Job posted"});
        
    } catch (error) {
        res.status(500).json({message:"Try Again later",error});
    }
})

//Job list route
router.get('/jobs',isAuth,async(req,res)=>{
    try {
        const jobs = await JobModel.find();
        //Checking... user present or not
        if(!jobs){
            return res.status(403).json({message : "no jobs found"});
        }
        res.status(200).json({message:"Job posted",jobs});
        
    } catch (error) {
        res.status(500).json({message:"Unable to find jobs...Try Again later",error});
    }
})

//Job list route
router.delete('/jobs',isAuth,async(req,res)=>{
    try {
        const jobs = await JobModel.deleteOne({_id:req.body.id});
        res.status(200).json({message:"Job deleted"});
        
    } catch (error) {
        res.status(500).json({message:"Try Again later",error});
    }
})
//Send Mail
router.post('/send-mail',isAuth,async(req,res)=>{
    try {
        //Mail transporter
        let transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.USER,
                pass:process.env.PASS
            }
        })
        //Message for mail...
        let message = {
            from: 'abdulwasimsguvi@gmail.com',
            to: req.body.email,
            subject: "Job Application - reg", 
            html: `<p>Job application from Chance</p><p>Email : ${req.body.email} , Message: ${req.body.message}</p><p>Thank you for using our page!</p>`, 

        }
        //Sending password reset link mail...
        let sendMail = await transporter.sendMail(message);
        
    } catch (error) {
        res.status(500).json({message:"Try Again later",error});
    }
})


export const RouterPage = router;
