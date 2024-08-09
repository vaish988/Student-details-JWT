const mongoose=require('mongoose')
const Schema=mongoose.Schema
const Students=require('../models/students') 


const personalSchema=new Schema({
address:{
    doorno:{
        type:Number,
        required:true
    },
    street:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    pin:{type:Number}
},
biodata:{
    name:{type:String,required:true},
    dob:{type:Date,required:true},
    gender:{type:String,required:true},
    native:{type:String}
},
student:{
    type:Schema.Types.ObjectId,ref:'Students'
}

})

const Personal=mongoose.model("Personal",personalSchema)
module.exports=Personal