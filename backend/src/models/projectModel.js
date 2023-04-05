const mongoose= require('mongoose')

const objectId= mongoose.Schema.Types.ObjectId
const projectSchema= new mongoose.Schema({
    name:{
        type:String
    },
    userId:{
        type:objectId,
        ref:"user"
    },

    taskList:{
        type:[objectId],
        ref:'tasks',
        default:[]
    },
    members:{
        type:[String],
        
        default:[]
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

module.exports=mongoose.model('projects',projectSchema)