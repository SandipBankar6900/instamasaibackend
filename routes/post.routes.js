const express=require("express");
const {PostModel}=require("../model/post.model");
const {auth}=require("../middleware/auth.middleware");

const postRouter=express.Router();

postRouter.use(auth);

postRouter.get("/",async(req,res)=>{
    try {
        const post=await PostModel.find({name:req.body.name});
        res.status(200).send(post)
    } catch (error) {
        res.status(400).send({"error":error})
    }
})

postRouter.post("/add",async(req,res)=>{
    try {
        const post=new PostModel(req.body)
        await post.save();
        res.status(200).send({"msg":"new post has been added","new_post":post})
        
    } catch (error) {
        res.status(400).send({"error":error})
    }
})


postRouter.patch("/update/:id",async(req,res)=>{
    const{id}=req.params;
    const post=await PostModel.findOne({_id:id});
    try {
        if(req.body.userId==post.userId){
            await PostModel.findByIdAndUpdate({_id:id},req.body);
            res.status(200).send({"msg":`The post with id ${id} has been updated`});

        }
        else{
            res.status(200).send({"msg":"you are not authorized"})
        }
    } catch (error) {
        res.status(400).send({"error":error})
    }
})


postRouter.delete("/delete/:id",async(req,res)=>{
    const{id}=req.params;
    const post=await PostModel.findOne({_id:id});
    try {
        if(req.body.userId==post.userId){
            await PostModel.findByIdAndDelete({_id:id});
            res.status(200).send({"msg":`The post with id ${id} has been deleted`});

        }
        else{
            res.status(200).send({"msg":"you are not authorized"})
        }
    } catch (error) {
        res.status(400).send({"error":error})
    }
})

module.exports={
    postRouter
}