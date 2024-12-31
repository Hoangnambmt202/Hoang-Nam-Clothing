const User = require("../models/User");

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
      const { name, email, phone, password, confirmPassword } = newUser
      try {
        const checkUser = await User.findOne({
          email: email
        })
        if(checkUser !== null) {
          resolve({
            status: "ÔK",
            message : "the email is already"
          })
        }

        const createdUser = await User.create({
          name,
          email, 
          phone,
          password, 
          confirmPassword 
        })
        if(createdUser) {
          resolve({
            status: "OK",
            message: "Đăng ký thành công",
            data: createdUser
          })
        }
      }
      catch (e) {
          reject(e);
      }
    })
}
module.exports = {
  createUser,
};