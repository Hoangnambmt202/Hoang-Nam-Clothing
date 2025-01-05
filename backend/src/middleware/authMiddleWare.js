const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleWare = async (req, res,next) => {
    
    const token = req.headers['authorization'].split(' ')[1];
    console.log('token:',token);
  
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
     if(err) {
         return res.status(404).json({
             status: "err",
             message: "Token is not valid"
         });
     }
     else {
         next();
     }
    });
}
const authUserMiddleWare = async (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];


  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err) {
      return res.status(404).json({
        status: "err",
        message: "Token is not valid 2",
      });
    }
    const { payload } = user;
    if (payload.isAdmin === false) {
      next();
    
    } 
    else {
      return res.status(404).json({
        status: "err",
        message: "You are not authorized",
      });
    }
  });
};


module.exports = {
    authMiddleWare,
    authUserMiddleWare,
};