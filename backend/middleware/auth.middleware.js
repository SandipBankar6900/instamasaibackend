const jwt=require("jsonwebtoken");
const {BlackListModel}=require("../model/black.model");


const auth=async(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1];
    if(token){
        const found=await BlackListModel.findOne({"token":token});
        if(found){
            res.status(200).send({"msg":"Please log in"})
            return;
        }
        else{
            jwt.verify(token,"token",(err,decode)=>{
                if(decode){
                    req.body.name=decode.name;
                    req.body.userId=decode.userId
                    next()
                }
                else{
                    res.status(400).send({"msg":"user has been not authorized","err":err})
                }
            })
        }
    }else{
        res.status(400).send({"error":error})
    }
}

module.exports={
    auth
}