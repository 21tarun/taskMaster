const projectModel=require('../models/projectModel')
const userModel=require('../models/userModel')
const taskModel=require('../models/taskModel')
const validator = require('validator')
const nodemailer = require('nodemailer');
const mongoose=require('mongoose')

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'kiara.wilkinson@ethereal.email',
        pass: 'ttVVFTRkm4chzaVZEM'
    }
});   


const createProject=async function(req,res){
    let data=req.body
    if(Object.keys(data).length==0)return res.status(400).send({status:false,message:"body is required"})
    console.log(data.userId)

    if(!data.userId)return res.status(400).send({status:false,message:"userId is required"})
    if (!mongoose.Types.ObjectId.isValid(data.userId)) return res.status(400).send({ status: false, message: "invalid userId" })

    let user=await userModel.findById(data.userId)
    if(!user) return res.status(404).send({status:false,message:"user not found"})


    if(!data.name)return res.status(400).send({status:false,message:"project name is required"})
    data.userId=req.userId
    const saveData= await projectModel.create(data)
    res.status(201).send({status:true,message:"project created successfully"})

    let projects= user.projects
    projects.push(saveData._id)
    await userModel.findByIdAndUpdate(data.userId,{projects:projects})



    

    


}

const getProject=async function(req,res){
    const projectId= req.params.projectId
    let flag=false
    console.log(projectId)
    if (!mongoose.Types.ObjectId.isValid(projectId)) return res.status(400).send({ status: false, message: "invalid projectId" })
    

    const project =await projectModel.findOne({_id:projectId,isDeleted:false}).populate([{
      path: 'taskList',
      model: 'tasks'
  }, {
      path: 'userId',
      model: 'user'
  }])
  
    if(!project) return res.status(404).send({status:false,message:"project not found"})

    const user= await userModel.findById(req.userId)
    if(!user)return res.status(404).send({status:false,message:"user not found"})

    let members=project.members
    
    // authorisation
    if(req.userId!=project.userId._id && !members.includes(user.email) )return res.status(403).send({status:false,message:"you are not authorised to open this project"})
    if(req.userId==project.userId._id )flag=true
    


    res.status(200).send({status:true,message:"success",data:project,flag:flag})

}

const getProjectOnMembers=async function(req,res){
    const data =req.body
    if(!data.email) return res.status(400).send({status:false,message:"email is required"})
    if (!validator.isEmail(data.email)) return res.status(400).send({ status: false, message: "please enter valid email address!" })

    let projects=await projectModel.find({ members: [data.email] })

    res.status(200).send({status:true,message:"data fetched successfully",data:projects})


}

const addMember =async function(req,res){
    const data=req.body
    if(Object.keys(data).length==0)return res.status(400).send({status:false,message:"body is required"})
    
    if(!data.userId)return res.status(400).send({status:false,message:"userId is required"})
    if (!mongoose.Types.ObjectId.isValid(data.userId)) return res.status(400).send({ status: false, message: "invalid userId" })

    if(!data.projectId)return res.status(400).send({status:false,message:"projectId is required"})
    if (!mongoose.Types.ObjectId.isValid(data.projectId)) return res.status(400).send({ status: false, message: "invalid projectId" })

    if(!data.email) return res.status(400).send({status:false,message:"email is required"})
    if (!validator.isEmail(data.email)) return res.status(400).send({ status: false, message: "please enter valid email address!" })


    let user=await userModel.findById(data.userId)
    if(!user)return res.status(404).send({status:false,message:"user not found"})

    let project=await projectModel.findById(data.projectId)
    if(!project)return res.status(404).send({status:false,message:"project not found"})



    if(project.userId!=data.userId)return res.status(403).send({status:false,message:"you can not add members to in this project"})

    let projectLink=`http://localhost:3000/project/${data.projectId}`

    var mailOptions = {
        from: 'Task Master',
        to: data.email,
        subject: 'Task Master',
        text: `join my project ${projectLink}`
      };


      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });




      
     res.send({status:true,message:"member added successfully"})

     let members=project.members
     members.push(data.email)
     await projectModel.findOneAndUpdate({_id:data.projectId},{members:members})




}
const deleteProject=async function(req,res){
  let projectId=req.body.projectId
  if(!projectId)return res.status(400).send({status:false,message:"projectId is required"})
  if (!mongoose.Types.ObjectId.isValid(projectId)) return res.status(400).send({ status: false, message: "invalid projectId" })
  
  let project =await projectModel.findOne({_id:projectId,isDeleted:false})
  if(!project) return res.status(400).send({status:false,message:"project not found"})

  //authorisation
  if(project.userId!=req.userId)return res.status(403).send({status:false,message:"you can not delete this project"})
  
  await projectModel.findByIdAndUpdate(projectId,{isDeleted:true})
  
  res.status(200).send({status:true,message:"successfully deleted"})
  

}

const editProject= async function(req,res){
  const projectId=req.body.projectId
  const name=req.body.name
  if(!name)return res.status(400).send({status:false,message:"name is required"})
  if(!projectId)return res.status(400).send({status:false,message:"projectId is required"})
  if (!mongoose.Types.ObjectId.isValid(projectId)) return res.status(400).send({ status: false, message: "invalid projectId" })
  
  let project =await projectModel.findOne({_id:projectId,isDeleted:false})
  if(!project) return res.status(400).send({status:false,message:"project not found"})

  //authorisation
  if(project.userId!=req.userId)return res.status(403).send({status:false,message:"you can not delete this project"})
  
  await projectModel.findByIdAndUpdate(projectId,{name:name})
  
  res.status(200).send({status:true,message:"successfully updated"})

}

module.exports.createProject=createProject
module.exports.getProject=getProject
module.exports.addMember=addMember
module.exports.getProjectOnMembers=getProjectOnMembers
module.exports.deleteProject=deleteProject
module.exports.editProject=editProject



