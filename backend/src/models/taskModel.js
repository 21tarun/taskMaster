const mongoose= require('mongoose')

const objectId= mongoose.Schema.Types.ObjectId
const taskSchema=new mongoose.Schema({
    name:{
        type:String
    },
    status:{
        type:String,
        default:'Todo'
    },
    projectId:{
        type:objectId
    },
    assignTo:{
        type:String
    },
    comments:{
        type:[objectId],
        ref:'comment'

    },
    totalComment:{
        type:Number,
        default:0
    },

    isDeleted:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

module.exports=mongoose.model('tasks',taskSchema)