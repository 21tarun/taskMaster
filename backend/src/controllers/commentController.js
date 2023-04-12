const taskModel=require("../models/taskModel")
const commentModel=require('../models/commentModel')
const mongoose=require('mongoose')

const createComment = async function(req,res){
    try{
        let data=req.body
        if(Object.keys(data).length==0)return res.status(400).send({status:false,message:"body is required"})
    
        if(!data.taskId)return res.status(400).send({status:false,message:"task Id missing"})
        if (!mongoose.Types.ObjectId.isValid(data.taskId)) return res.status(400).send({ status: false, message: "invalid taskId" })
    
        if(!data.userId)return res.status(400).send({status:false,message:"userId Id missing"})
        if (!mongoose.Types.ObjectId.isValid(data.userId)) return res.status(400).send({ status: false, message: "invalid userId" })
    
        if(!data.message) return res.status(400).send({status:false,message:"comment required"})
    
        let task=await taskModel.findOne({_id:data.taskId,isDeleted:false}).populate('comments')
        if(!task) return res.status(404).send({status:false,message:"task not found"})
    
        let current = new Date();
        let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
        let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
        let dateTime = cDate + ' ' + cTime;
        data.dateTime=dateTime
    
        const saveComment=await commentModel.create(data)
        res.status(201).send({status:true,message:"successfully created",data:saveComment})
    
        let comments= task.comments
        comments.push(saveComment._id)
        let count=0
        for(let i=0;i<comments.length;i++){
            if(comments[i].isDeleted==false)count++
        }
        await taskModel.findByIdAndUpdate(data.taskId,{comments:comments,totalComment:count})

    }
    catch(err){
        res.status(500).send({status:false,message:err.message})
    }
}

const deleteComment =async function(req,res){
   
    try{
        let commentId= req.body.commentId
        let taskId= req.body.taskId
        if(!taskId)return res.status(400).send({status:false,message:"task Id missing"})
        if (!mongoose.Types.ObjectId.isValid(taskId)) return res.status(400).send({ status: false, message: "invalid taskId" })
    
        if(!commentId)return res.status(400).send({status:false,message:"commentId missing"})
        if (!mongoose.Types.ObjectId.isValid(commentId)) return res.status(400).send({ status: false, message: "invalid commentId" })
    
    
        const comment =await commentModel.findOne({_id:commentId,isDeleted:false})
        if(!comment)return res.status(404).send({status:false,message:"comment not found"}).populate('userId')
    
        // authorization 1st layer
        if(comment.taskId!=taskId)return res.status(403).send({status:false,message:"you can not delete this comment"})
        
        const task =await taskModel.findOne({_id:taskId,isDeleted:false})
        if(!task)return res.status(404).send({status:false,message:"task not found"})
    
        // authorization  2nd layer
        
        if(req.userId!=comment.userId._id)return res.status(403).send({status:false,message:"you can not deleted this comment"})
    
        await commentModel.findOneAndUpdate({_id:commentId},{isDeleted:true})
        res.status(200).send({status:true,message:"comment successfully deleted"})
    
        let total= task.totalComment
        await taskModel.findOneAndUpdate({_id:taskId},{totalComment:total-1})

    }
    catch(err){
        res.status(500).send({status:false,message:err.message})
    }

}
module.exports.createComment=createComment
module.exports.deleteComment=deleteComment