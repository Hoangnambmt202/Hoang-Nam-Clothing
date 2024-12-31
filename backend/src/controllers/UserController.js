const UserService = require('../services/UserService')

const createUser = async (req,res)=> {
    try {
        const reg =
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const {name, email, phone, password, confirmPassword} = req.body;
        const isEmail = reg.test(email);
        if (!name || !email || !phone || !password || !confirmPassword) {
          return res.status(200).json({
            status: "err",
            message: "the input is required",
          });
        } else if (!isEmail) {
          return res.status(200).json({
            status: "err",
            message: "the input must be email",
          });
        } else if (password != confirmPassword) {
          return res.status(200).json({
            status: "err",
            message: "password is not equal confirmed",
          });
        }
        
     
       
        
        const response = await UserService.createUser(req.body);
        return res.status(200).json(response)
    }
    catch (e) {
        return res.status(404).json({
            message : e
        })
    }
}
module.exports = {
    createUser
}