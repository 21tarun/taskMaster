const mongoose= require('mongoose')

const objectId= mongoose.Schema.Types.ObjectId
const userSchema= new mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    projects:{
        type:[objectId],
        ref:'projects',
        default:[]
    }
},{timestamps:true})

module.exports=mongoose.model('user',userSchema)