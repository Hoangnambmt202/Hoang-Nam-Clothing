const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleWare = async (req, res,next) => {
    // console.log('checktoken:',req.headers['authorization']);
    const token = req.headers['authorization'].split(' ')[1];

  
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
     if(err) {
         return res.status(404).json({
             status: "err",
             message: "Token is not valid"
         });
     }
     const {payload} = user;
     if(payload.isAdmin === false) {
         return res.status(404).json({
             status: "err",
             message: "You are not admin"
         });
        console.log('user:',user);
    }
    else {
      
        next();
    }
    });
}


module.exports = {
    authMiddleWare
    
};