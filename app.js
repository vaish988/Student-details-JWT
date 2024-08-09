const express=require('express')
const bodyParser=require('body-parser')

const db=require('./db')
const authroutes=require('./routes/authroutes')
const protectedRoute=require('./routes/protectedRoute')

const app=express()

app.use(bodyParser.json())

app.use('/auth',authroutes)
app.use('/protected',protectedRoute)

app.listen(3000,()=>{
    console.log("Running...")
})