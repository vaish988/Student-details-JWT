const express=require('express')
const router = express.Router()
const educationcontroller=require('../controllers/educationcontroller')
const studentcontroller=require('../controllers/studentcontroller')
const { verifyToken, authorizeRoles } = require('../middleware/authmiddleware')
const Students = require('../models/students')
const Admin = require('../models/admin')
const Personal=require('../models/personal')
const Educational=require('../models/educational')


router.get('/', verifyToken,(req,res)=>{
   res.status(200).json({message:'Protected route accessed'})

})

router.get('/profile',verifyToken,async(req,res)=>{
    try {
        const userId=req.user.userId
        const role=req.user.role
        let user
        if (role === 'Admin'){
         user=await Admin.findById(userId).select('-password -__v')
        }
        else if(role === 'Student'){
         user=await Students.findById(userId).select('-password -__v')
        }
 
        if(!user){
            return res.status(404).json({message:'user not found'})
        }
        res.json(user)
 
    }catch(error){
        res.status(500).json({error:"Server error",details:error.message})
    }
 })



//Create a data done by both students and admin
router.post('/createuser', verifyToken, authorizeRoles('Admin', 'Student'),studentcontroller.createuserdetails)
//Get all students by only admin
router.get('/allstudents',verifyToken,authorizeRoles('Admin'),studentcontroller.getallstudents)
//post a education for an existing student
router.post('/educationpost/:userId',verifyToken,authorizeRoles('Admin','Student'),educationcontroller.educationpost)
//Get eduactional details for specific user id
router.get('/getspecificusereducation/:userId',verifyToken,authorizeRoles('Admin'),educationcontroller.getspecificusereducation)
//Get one student details by their id only by admin
router.get('/getonestudent/:userId',verifyToken,authorizeRoles('Admin'),studentcontroller.getonestudent)
//update one studnet 
//router.put('/studentsupdate/:id',verifyToken,authorizeRoles('Admin','Student'),studentcontroller)
//Delete one student details
router.delete('/studentdelete/:userId',verifyToken,authorizeRoles('Admin'),studentcontroller.studentdelete)
//Delete student's education by admin
router.delete('/educationdelete/:userId',verifyToken,authorizeRoles('Admin'),educationcontroller.educationdelete)
//Get specific education details of given userId student by level
router.get('/specificeducation/:userId',verifyToken,authorizeRoles('Admin','Student'),educationcontroller.specificeducation)
//update the education by the userid and their level by both admin and student
router.put('/educationupdate/:userId',verifyToken,authorizeRoles('Admin','Student'),educationcontroller.educationupdate)




module.exports=router