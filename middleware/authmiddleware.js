const jwt=require('jsonwebtoken')

function verifyToken(req,res,next){
    const token=req.header('Authorization')
    if(!token){
        return res.status(401).json({error:'Access denied'})
    }
    try{
        const decoded=jwt.verify(token,'your-secret-key')
        req.user=decoded
        next()
    }
    catch(error){
        res.status(401).json({error:"Invalid token",details:error.message})
    }
}

function authorizeRoles(...roles){
     return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({error:"You do not have permission to perform this operation"}) 
        }
        next()
     }
}

module.exports ={
    verifyToken,
    authorizeRoles
}