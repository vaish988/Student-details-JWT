const mongoose=require('mongoose')
const Schema=mongoose.Schema
const Students=require('../models/students') 

const educationSchema=new Schema({
    current:{type:String,required:true},
    education:{
        level:{
            type:String,required:true,enum:['SSLC','HSC','Diploma','UG','PG'],
            default:'SSLC'
        },
        institute:{
            name:{type:String,required:true},
            location:{type:String,required:true}
        },
        marks:{
            type:Number,
            required:true
        }

    },
    student:{
        type:Schema.Types.ObjectId,ref:'Students'
    }
})

const Educational=mongoose.model("Educational",educationSchema)
module.exports=Educational