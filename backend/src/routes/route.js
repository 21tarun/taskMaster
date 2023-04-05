const express= require('express')
const router=express.Router()
const userController =require("../controllers/userController")
const projectController=require("../controllers/projectController")
const taskController=require('../controllers/taskController')
const middlewares =require('../middlewares/auth')

router.get("/",function(req,res){
    res.send({message:"all are good"})
})


router.post("/createUser",userController.createUser)
router.post("/login",userController.login)
router.get("/getUserProjects",middlewares.authentication,userController.getUserProjects)

router.post("/createProject",middlewares.authentication,projectController.createProject)
router.get("/project/:projectId",middlewares.authentication,projectController.getProject)

router.post("/createTask",middlewares.authentication,taskController.createTask)
router.put("/editTask",middlewares.authentication,taskController.editTask)
router.delete("/deleteTask",middlewares.authentication,taskController.deleteTask)

router.post("/addMember",middlewares.authentication,projectController.addMember)
router.post('/getProjectOnMembers',middlewares.authentication,projectController.getProjectOnMembers)
router.delete('/deleteProject',middlewares.authentication,projectController.deleteProject)
router.put('/editProject',middlewares.authentication,projectController.editProject)


module.exports=router