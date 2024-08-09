const express=require('express')
const Students=require('../models/students')
const Admin=require('../models/admin')
const Personal=require('../models/personal')
const Educational=require('../models/educational')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')


const router=express.Router()


//User registration
router.post('/register',async(req,res)=>{
    try{
        const {name,email,password,mobile,role}=req.body 
        if(!name || !email || !password || !mobile || !role ){
            return res.status(400).json({error:"All fields are required"})
        }
        let user;
        const hashedpassword=await bcrypt.hash(password,10)
        if(role === "Admin"){
             user=new Admin({
                name,email,password:hashedpassword,mobile,role
            })
        }
        else if(role === "Student"){
            user=new Students({
            name,email,password:hashedpassword,mobile,role
        })}
        else{
            return res.status(400).json({error:'Invalid Role'})
        }
        await user.save()
        res.status(201).json({message:"Registration Successful.."})
    }catch(error){res.status(500).json({error:"Registration Failed",details:error.message})}
})


//User login
router.post('/login', async (req, res) => {
    try {
        let user;
        const { email, password , role } = req.body;
        if(role === "Admin"){
             user = await Admin.findOne({ email });
        }
        else if(role ==="Student"){
            user = await Students.findOne({ email });    
        }
        
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed...User Not Found' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed...Incorrect Password' });
        }
        const token = jwt.sign({ userId: user._id ,role:user.role}, 'your-secret-key', { expiresIn: '1h' });
        res.status(200).json({ message:"Logged In",token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed', details: error.message });
    }
});

module.exports =router;