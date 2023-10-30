const express=require("express");

const bcrypt=require('bcrypt');
const jwt=require("jsonwebtoken");
const {UserModel}=require("../model/user.model");
const {BlackListModel}=require("../model/black.model")

const userRouter=express.Router();

userRouter.post("/register",async(req,res)=>{
    const{ name,
        email,
        gender,
        password,
       age ,
       city,
       is_married}=req.body;

       let existingaccount=await UserModel.findOne({email});
       if(existingaccount){
        return res.status(200).send({"msg":"User already exist, please login"})
       }

       try {
        
        bcrypt.hash(password,5,async(err,hash)=>{
            if(err){
                res.status(400).send({"error":err.message})
            }
            else{
                const user=new UserModel({

                    name,
                    email,
                    gender,
                    password:hash,
                   age ,
                   city,
                   is_married
                })
                await user.save();
                res.status(200).send({"msg":"New user has been registerd","newuser":user})
            }
        })
        
       } catch (error) {
        res.status(400).send({"error":error})
       }
       
})

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try {
        const user=await UserModel.findOne({email})
        if(user){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result){
                    const token=jwt.sign({name:user.name,userId:user._id},"token",{expiresIn:7});
                    res.status(200).send({"msg":"User has been login successful!","token":token})
                }
                else{
                    res.status(400).send({"error":err.message})
                }
            })
        }
        
    } catch (error) {
        res.status(400).send(error);

    }
})

userRouter.get("/logout",async(req,res)=>{
    try {
        const token=req.headers.authorization?.split(" ")[1];
        const blacklist=new BlackListModel({"token":token});
        await blacklist.save();
        res.status(200).send({"msg":"User has been logged out"})
    } catch (error) {
        res.status(400).send({"error":error})
    }
})

module.exports={
    userRouter
}