const express=require("express");
require("dotenv").config();
const cors=require("cors");

const {connection}=require("./db");
const {userRouter}=require("../backend/routes/user.routes");
const {postRouter}=require("../backend/routes/post.routes")

const app=express();

app.use(cors());
app.use(express.json());

app.use("/users",userRouter);
app.use("/posts",postRouter)



app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("connected to DB");
        console.log(`server is running at port ${process.env.port}`)
        
    } catch (error) {
        console.log(error)
    }
})