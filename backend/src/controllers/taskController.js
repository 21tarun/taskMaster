const taskModel=require('../models/taskModel')
const projectModel=require('../models/projectModel')




const mongoose=require('mongoose')


const createTask=async function(req,res){
    let data=req.body
    if(Object.keys(data).length==0)return res.status(400).send({status:false,message:"body is required"})
    

    if(!data.projectId)return res.status(400).send({status:false,message:"projectId is required"})
    if (!mongoose.Types.ObjectId.isValid(data.projectId)) return res.status(400).send({ status: false, message: "invalid projectId" })

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

const editTask=async function(req,res){
    const taskId= req.body.id
    const status=req.body.status
    if(!taskId)return res.status(400).send({status:false,message:"not getting task data from body"})
    if (!mongoose.Types.ObjectId.isValid(taskId)) return res.status(400).send({ status: false, message: "invalid taskId" })
    

    const task =await taskModel.findOneAndUpdate({_id:taskId,isDeleted:false},{status:status},{new:true})
    if(!task) return res.status(404).send({status:false,message:"task not found"})

  

    res.status(200).send({status:true,message:"status updated successfully"})

}

const deleteTask=async function(req,res){
    const taskId= req.body.id
    if(!taskId)return res.status(400).send({status:false,message:"not getting task data from body"})
    if (!mongoose.Types.ObjectId.isValid(taskId)) return res.status(400).send({ status: false, message: "invalid taskId" })
    

    const task =await taskModel.findOneAndUpdate({_id:taskId,isDeleted:false},{isDeleted:true},{new:true})
    if(!task) return res.status(404).send({status:false,message:"task not found"})

  

    res.status(200).send({status:true,message:"task deleted successfully"})

}

module.exports.createTask=createTask
module.exports.editTask=editTask
module.exports.deleteTask=deleteTask



