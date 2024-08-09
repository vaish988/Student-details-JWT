const mongoose=require('mongoose')
const Schema=mongoose.Schema
const Personal=require('./personal')
const Educational=require('./educational')

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true,
        unique:true
    },
    role:
    {
        type:String,
        required:true,
        default:'Student'
    },
    personaldet:{
        type:Schema.Types.ObjectId,
        ref:"Personal"
    },
    educationaldet:[{type:Schema.Types.ObjectId,ref:"Educational"}]
})
const Students=mongoose.model('Students',userSchema)
module.exports=Students