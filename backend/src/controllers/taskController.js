const taskModel=require('../models/taskModel')
const projectModel=require('../models/projectModel')
const mongoose=require('mongoose')


const createTask=async function(req,res){
    try{
        let data=req.body
        if(Object.keys(data).length==0)return res.status(400).send({status:false,message:"body is required"})
        
    
        if(!data.projectId)return res.status(400).send({status:false,message:"projectId is required"})
        if (!mongoose.Types.ObjectId.isValid(data.projectId)) return res.status(400).send({ status: false, message: "invalid projectId" })
    
        if(!data.assignTo)return res.status(400).send({status:false,message:"assignTo email id  is required"})
    
        let project=await projectModel.findById(data.projectId)
        if(!project) return res.status(404).send({status:false,message:"project not found"})
    
    
        if(!data.name)return res.status(400).send({status:false,message:"task name is required"})
        // data.userId=req.userId
        const saveData= await taskModel.create(data)
        res.status(201).send({status:true,message:"task created successfully"})
    
        let tasks= project.taskList
        tasks.push(saveData._id)
        await projectModel.findByIdAndUpdate(data.projectId,{taskList:tasks})

    }
    catch(err){
        res.status(500).send({status:false,message:err.message})
    }

    

    


}
const getTaskById =async function(req,res){
    try{
        const taskId= req.body.taskId
        if(!taskId)return res.status(400).send({status:false,message:"not getting task id from body"})
        if (!mongoose.Types.ObjectId.isValid(taskId)) return res.status(400).send({ status: false, message: "invalid taskId" })
        const task=await taskModel.findOne({_id:taskId,isDeleted:false}).populate('comments').populate({path:'comments',populate:['userId']})
        if(!task) return res.status(404).send({status:false,message:"task not found"})
        return res.status(200).send({status:true,message:"success",data:task})

    }
    catch(err){
        res.status(500).send({status:false,message:err.message})
    }
}

const editTask=async function(req,res){
    try{
        const taskId= req.body.id
        const status=req.body.status
        if(!taskId)return res.status(400).send({status:false,message:"not getting task data from body"})
        if (!mongoose.Types.ObjectId.isValid(taskId)) return res.status(400).send({ status: false, message: "invalid taskId" })
        
    
        const task =await taskModel.findOneAndUpdate({_id:taskId,isDeleted:false},{status:status},{new:true})
        if(!task) return res.status(404).send({status:false,message:"task not found"})
        res.status(200).send({status:true,message:"status updated successfully"})

    }
    catch(err){
        res.status(500).send({status:false,message:err.message})
    }

}

const deleteTask=async function(req,res){
    try{
        const taskId= req.body.id
        if(!taskId)return res.status(400).send({status:false,message:"not getting task data from body"})
        if (!mongoose.Types.ObjectId.isValid(taskId)) return res.status(400).send({ status: false, message: "invalid taskId" })
        
    
        const task =await taskModel.findOneAndUpdate({_id:taskId,isDeleted:false},{isDeleted:true},{new:true})
        if(!task) return res.status(404).send({status:false,message:"task not found"})
    
        res.status(200).send({status:true,message:"task deleted successfully"})

    }
    catch(err){
        res.status(500).send({status:false,message:err.message})
    }

}

module.exports.createTask=createTask
module.exports.editTask=editTask
module.exports.deleteTask=deleteTask
module.exports.getTaskById=getTaskById



