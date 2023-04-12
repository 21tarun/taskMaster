
const validator = require('validator')
const userModel=require('../models/userModel')
const jwt=require('jsonwebtoken')
const mongoose=require('mongoose')


const createUser =async function(req,res){
    try{
        let data= req.body
        if(Object.keys(data).length==0)return res.status(400).send({status:false,message:"body is required"})
    
        if(!data.name) return res.status(400).send({status:false,message:"name is required"})
        if(!data.email) return res.status(400).send({status:false,message:"email is required"})
        if (!validator.isEmail(data.email)) return res.status(400).send({ status: false, message: "please enter valid email address!" })
    
        const user= await userModel.findOne({email:data.email})
        if(user) return res.status(400).send({status:false,message:"email alredy exist"})
    
        if(!data.password) return res.status(400).send({status:false,message:"name is required"})
        const saveData =await userModel.create(data)
        res.status(201).send({status:true,message:"user created successfully",data:saveData})
    }
    catch(err){
        res.status(500).send({status:false,message:err.message})
    }
}

const login =async function(req,res){
    try{
        let data= req.body
        if(Object.keys(data).length==0)return res.status(400).send({status:false,message:"body is required"})
    
        if(!data.email) return res.status(400).send({status:false,message:"name is required"})
        if (!validator.isEmail(data.email)) return res.status(400).send({ status: false, message: "please enter valid email address!" })
        if(!data.password) return res.status(400).send({status:false,message:"name is required"})
    
        let user= await userModel.findOne({email:data.email,password:data.password})
        if(!user) return res.status(401).send({status:false,message:"email id or password is worng"})
    
        let token= jwt.sign({userId:user._id},"kuchh-bhi",{expiresIn: '24h'})
        return res.status(200).send({status:true,message:"success",userId:user._id,token:token,name:user.name})
    }
    catch(err){
        res.status(500).send({status:false,message:err.message})

    }



}

const getUserProjects= async function(req,res){
    try{
        if(!req.userId) return res.status(400).send({status:false,message:"userId is required"})
        if (!mongoose.Types.ObjectId.isValid(req.userId)) return res.status(400).send({ status: false, message: "invalid userId" })
        const userData= await userModel.findById(req.userId).populate(['projects'])
        res.status(200).send({status:true,message:"success",data:userData})
    }
    catch(err){
        res.status(500).send({status:false,message:err.message})

    }
}





module.exports.createUser=createUser
module.exports.login=login
module.exports.getUserProjects=getUserProjects