const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generalAccessToken , generateRefreshToken} = require("./JwtService");



const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
      const { name, email, phone, password,confirmPassword } = newUser
      try {
        const checkUser = await User.findOne({
          email: email
        })
        if(checkUser !== null) {
          resolve({
            status: "ÔK",
            message : "Email đã tồn tại"
          })
        }

        const hash = bcrypt.hashSync(password, 10);
        const createdUser = await User.create({
          name,
          email, 
          phone,
          password: hash,
          confirmPassword: hash, 
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
const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const {phone, password } = userLogin;
    try {
      const checkUser = await User.findOne({
        phone: phone,
      });
      if (checkUser === null) {
        resolve({
          status: "err",
          message: "Không tìm thấy người dùng",
        });
      }
      const checkPassword = bcrypt.compareSync(password, checkUser.password);

      
      if (!checkPassword) {
        resolve({
          status: "err",
          message: "Mật khẩu không đúng. Vui lòng thử lại!",
        
        });
      }
      
      const access_token = await generalAccessToken(
        {
          _id: checkUser._id,
         isAdmin : checkUser.isAdmin,
        }
      );
      const refresh_token = await generateRefreshToken(
        {
          _id: checkUser._id,
          isAdmin : checkUser.isAdmin,
        }
      );
   

      resolve({
        status: "OK",
        message: "Đăng nhập thành công",
        data: checkUser,
        access_token,
        refresh_token,

      });
      
    } catch (e) {
      reject(e);
    }
  });
};
const updateUser = (id,data) => {
  return new Promise(async (resolve, reject) => {
   
    try {
      const checkUser = await User.findOne({_id:id});
      console.log('checkUser:',checkUser);
      if(checkUser === null) {
        resolve({
          status: "OK",
          message: "User not found"
        })
      };
      const updatedUser = await User.findByIdAndUpdate(id,data, {new: true});

      
      resolve({
        status: "OK",
        message: `Cập nhật thành công cho user:  ${updatedUser.name} `,
        data: updatedUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });

      if (checkUser === null) {
        resolve({
          status: "OK",
          message: "Không tìm thầy người dùng",
        });
      }

      await User.findByIdAndDelete(id);

      resolve({
        status: "OK",
        message: `Xoá thành công user: ${checkUser.name} với email :${checkUser.email}`,
  
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
    
      const user = await User.find();
      resolve({
        status: "OK",
        message: "Danh sách người dùng",
        data: user,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getDetailUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const 
      user = await User.findOne({ _id: id });

      if (
        user === null) {
        resolve({
          status: "OK",
          message: "Không tìm thầy người dùng",
          data: user,
        });
      }
      
      resolve({
        status: "OK",
        message: "Chi tiết người dùng",
        data: user,
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailUser,
 
};