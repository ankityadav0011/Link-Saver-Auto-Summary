const jwt = require("jsonwebtoken")

module.exports = function(req,res,next){
   const token = req.header('token');
   console.log(token)
   if(!token){
      return res.status(401).json({
        message:"Token not found"
      })
   }
   try{
      const decoded = jwt.verify(token,process.env.JWT_SECRET);
      req.user = decoded;
      next();
   }
   catch(e){
      return res.status(401).json({
        message:"Invalid token or something wrong with token"
      })
   }
}