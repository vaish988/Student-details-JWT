//const express=require('express')
const Students=require('../models/students')
const Admin=require('../models/admin')
//const Personal=require('../models/personal')
const Educational=require('../models/educational')
//const { verifyToken, authorizeRoles } = require('../middleware/authmiddleware')
//const router = require('../routes/authroutes')



//post a education for an existing student
exports.educationpost=async(req,res)=>{
    try{
        let userId=req.params.userId
        const {educational}=req.body
        if (req.user.role === 'Admin'){
             userId  = req.params.userId
        }
        else if(req.user.role === 'Student'){
            let loggedId=req.user.userId
            if(userId !== loggedId){
                return res.status(400).json({error:'You do not have a permission to update another student'})
            }
            
            userId = loggedId
        }

        
        const user=await Students.findById(userId)
        if(!user){
            return res.status(404).send({message:"Student Not found"})
        }
        //add education
        const edu=new Educational({
            current:educational.current,
            education:{
                level:educational.education.level,
                institute:{
                    name:educational.education.institute.name,
                    location:educational.education.institute.location
                },
                marks:educational.education.marks
            },
            student:user._id
        })

        await edu.save()
      //  console.log("Education added to the given user")
        //education linked with student
        user.educationaldet.push(edu._id)
        await user.save()
      
        res.status(201).send({
            message:"Education Added to the user",
            user
        })
    }
    catch(error){
        console.error(error),
        res.status(500).send({message:"Server Error"})
    }
}



//Get education of specific user only by the Admin
exports.getspecificusereducation=async(req,res)=>{
    try{
    const {userId}=req.params

    const edu = await Students.findById(userId).select('name educationaldet')
               .populate('educationaldet').lean() 
    if(!edu || edu===0){
        return res.status(404).send({message:"Student Not found"})
    }
    edu.educationaldet.forEach(item => {
        delete item.student;
        delete item.__v;
    })
  //  console.log(edu)
    res.send(edu)}
    catch(error){
        console.error(error)
        res.status(500).send({message:"Server error"})
    }
}

//Delete one student's education by admin
exports.educationdelete=async(req,res)=>{
    const {userId}=req.params
    try{
        const stud=await Students.findById(userId)
        if (!stud){
            return res.status(404).json({error:"Student not found"})

        }
        await Educational.deleteMany({student:userId})

        stud.educationaldet=[]
        await stud.save()
        
        res.status(200).json({message:"Educational details of given student is deleted successfully" })
    }
    catch(error){
        console.error(error)
        res.status(500).json({error:"Internal Server Error"})
    }
}

exports.specificeducation = async(req,res)=>{
    try{
        const {level}=req.query
        let userId=req.params.userId
        if (req.user.role === 'Admin'){
             userId  = req.params.userId
        }
        else if(req.user.role === 'Student'){
            let loggedId=req.user.userId
            if(userId !== loggedId){
                return res.status(400).json({error:'You do not have a permission to view another student\'s details'})
            }
            
            userId = loggedId
        }
        
    const user=await Educational.findOne({student:userId,'education.level':level})
    if (!user){
        return res.status(404).json({error:"Student not found"})

    }
    
    res.json({mesaage:"Fetched Successfully",user})
    }
    catch(error){
        console.error(error)
        res.status(500).json({error:"Internal Server Error"})
    }

}

exports.educationupdate = async(req,res)=>{
    try{
        
    const {level}=req.query
    const {data}=req.body
    let userId=req.params.userId
        if (req.user.role === 'Admin'){
             userId  = req.params.userId
        }
        else if(req.user.role === 'Student'){
            let loggedId=req.user.userId
            if(userId !== loggedId){
                return res.status(400).json({error:'You do not have a permission to update another student\'s details'})
            }
            
            userId = loggedId
        }
    const user=await Educational.findOneAndUpdate({student:userId,'education.level':level},{$set:data},{new:true,runValidators:true})
    if (!user){
        return res.status(404).json({error:"Student not found"})

    }
    
    res.status(200).json({message:"Updated Successfully",user})
    }
    catch(error){
        console.error(error)
        res.status(500).json({error:"Internal Server Error"})
    }

}
