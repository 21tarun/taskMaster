const jwt = require('jsonwebtoken')
// const ObjectId = require('mongoose').Types.ObjectId

const authentication = async function(req,res,next){
    
    let token=req.headers['x-api-key']

    if(!token) return res.status(401).send({status:false,message:"not getting token"})
    


    jwt.verify(token,"kuchh-bhi",function(err,decodedToken){
        if(err) return res.status(401).send({status:false,message:"token expired"})
        else{
            req.userId= decodedToken.userId

            next()
        }
    })

}



module.exports.authentication=authentication
