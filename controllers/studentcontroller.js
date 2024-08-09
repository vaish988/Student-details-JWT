const bcrypt=require('bcrypt')
const Students=require('../models/students')
const Admin=require('../models/admin')
const Personal=require('../models/personal')
const Educational=require('../models/educational')
const { verifyToken, authorizeRoles } = require('../middleware/authmiddleware')
const router = require('../routes/authroutes')

//Create a data done by both students and admin
exports.createuserdetails= async (req, res) => {
    const { student,personal, educational } = req.body;
    let stud;

    try {
        if (req.user.role === 'Admin') {
            // Admin can create a new student
            stud = new Students({ 
                name:student.name,
                email:student.email,
                password:await bcrypt.hash(student.password,10),
                mobile:student.mobile,
                role:student.role
             });
            await stud.save();
        } else if (req.user.role === 'Student') {
            // Student can only modify their own details
            stud = await Students.findById(req.user.userId);
            if (!stud) {
                return res.status(404).json({ error: "Student not found." });
            }
        }

        // Check if the personal details already exist, update if they do
        let pers = await Personal.findOne({ student: stud._id });
        if (pers) {
            // Update existing personal details
            pers.address = {
                doorno: personal.address.doorno,
                street: personal.address.street,
                city: personal.address.city,
                pin: personal.address.pin,
            };
            pers.biodata = {
                name: personal.biodata.name,
                dob: personal.biodata.dob,
                gender: personal.biodata.gender,
                native: personal.biodata.native,
            };
        } else {
            // Create new personal details
            pers = new Personal({
                address: {
                    doorno: personal.address.doorno,
                    street: personal.address.street,
                    city: personal.address.city,
                    pin: personal.address.pin,
                },
                biodata: {
                    name: personal.biodata.name,
                    dob: personal.biodata.dob,
                    gender: personal.biodata.gender,
                    native: personal.biodata.native,
                },
                student: stud._id,
            });
        }
        await pers.save();

        // Associate personal details with the student
        stud.personaldet = pers._id;

        // Check if the educational details already exist, update if they do
        let edu = await Educational.findOne({ student: stud._id });
        if (edu) {
            // Update existing educational details
            edu.current = educational.current;
            edu.education = {
                level: educational.education.level,
                institute: {
                    name: educational.education.institute.name,
                    location: educational.education.institute.location,
                },
                marks: educational.education.marks,
            };
        } else {
            // Create new educational details
            edu = new Educational({
                current: educational.current,
                education: {
                    level: educational.education.level,
                    institute: {
                        name: educational.education.institute.name,
                        location: educational.education.institute.location,
                    },
                    marks: educational.education.marks,
                },
                student: stud._id,
            });
        }
        await edu.save();

        // Associate educational details with the student
        stud.educationaldet = edu._id;
        await stud.save();

        // Send response with success message
        res.status(201).json({
            message: "User personal and educational details created/updated successfully",
            user: stud,
            personal_details: pers,
            educational_details: edu,
        });
    } catch (error) {
        console.error("Error in creating/updating details", error);
        res.status(500).json({ error: "Failed to create/update details" });
    }
};

//Get all students by only admin
exports.getallstudents=async(req,res)=>{
    try{
        const students=await Students.find({}).populate('personaldet').populate('educationaldet')

        if(!students){
            res.status(404).send({message:"No Students found"})
        }
    //    console.log(students)
        res.status(200).send({message:"All student details are fetched successfully",students})
    }
    catch(error){
        console.error(error)
        res.status(500).send({message:"Internal Server error"})
    }
}


//Get one student details
exports.getonestudent=async(req,res)=>{
    try{
        const {userId}=req.params
        const student=await Students.findById(userId).select('personaldet educationaldet').populate('personaldet').populate('educationaldet').lean()
        if(!student){
            res.status(404).send({message:"Student Not found"})
        }
        student.educationaldet.forEach(item => {
            delete item.student;
            delete item.__v;
            delete item._id;
        })
        delete student.personaldet.student
        delete student.personaldet.__v
        delete student.personaldet._id

  //      console.log(student)
        res.status(200).send({message:"Given Student detail is fetched",student})
    }
    catch(error){
        console.error(error)
        res.status(500).send({message:"Internal Server Error"})
    }
}

//Delete one student
exports.studentdelete=async(req,res)=>{
    try{
       const { userId }=req.params
       const stud=await Students.findById(userId)
       if(!stud){
           return res.status(404).json({error:"Studnet not found"})
   
       }
       await Personal.deleteOne({student:userId})
       await Educational.deleteMany({student:userId})
   
       await Students.findByIdAndDelete(userId)
   
       res.status(200).json({
           mesaage:"Student details were deleted successfully"
       })
   }
   catch(error){
       console.error(error)
       res.status(500).send({message:"Internal Server Error"})
   }
   }