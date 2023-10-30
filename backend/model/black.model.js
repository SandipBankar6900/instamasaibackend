const mongoose=require("mongoose");
const blacklistSchema=mongoose.Schema({
    token:String
},{
    versionKey:false
})

const BlackListModel=mongoose.model("blocklist",blacklistSchema)

module.exports={
    BlackListModel
}