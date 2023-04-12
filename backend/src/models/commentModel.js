const mongoose =require('mongoose')
const objectId= mongoose.Schema.Types.ObjectId

const commentSchema =new mongoose.Schema({
    taskId:objectId,
    userId:{
        type:objectId,
        ref:"user"
    },
    message:String,
    dateTime:String,


    isDeleted:{
        type:Boolean,
        default:false
    }

})

module.exports = mongoose.model("comment", commentSchema)