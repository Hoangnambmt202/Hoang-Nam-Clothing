const UserService = require("../services/UserService");
const JwtService = require("../services/JwtService");


const createUser = async (req, res) => {
  try {
    const reg =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const {  email, phone, password, confirmPassword } = req.body;
   
    const isEmail = reg.test(email);
    if (!email || !phone || !password || !confirmPassword) {
      return res.status(200).json({
        status: "err",
        message: "Trường này là bắt buộc!",
      });
    } else if (!isEmail) {
      return res.status(200).json({
        status: "err",
        message: "Trường này phải là email",
      });
    }
    else if (phone.length < 10) {
      return res.status(200).json({
        status: "err",
      message: "Số điện thoại quá ngắn",
      })
    }
    
    else if (password != confirmPassword) {
      return res.status(200).json({
        status: "err",
        message: "Mật khẩu và nhập lại mật khẩu không khớp",
      });
    }

    const response = await UserService.createUser(req.body);
 
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const loginUser = async (req, res) => {
  try {
    
    const { phone, password } = req.body;
    const isPhone = req.length = 10 ;
    if ( !phone || !password) {
      return res.status(200).json({
        status: "err",
        message: "Vui lòng điền đầy đủ thông tin đăng nhập",
      });
    } else if (!isPhone) {
      return res.status(200).json({
        status: "err",
        message: "Số điện thoại không hợp lệ",
      });
    } ;
    

    const response = await UserService.loginUser(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    if (!userId) {
      return res.status(200).json({
        status: "err",
        message: "the user id is required",
      });
    }
    console.log(userId);

    const response = await UserService.updateUser(userId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const token = req.headers.token;

    if (!userId) {
      return res.status(200).json({
        status: "err",
        message: "the user id is required",
      });
    }

    const response = await UserService.deleteUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getAllUser = async (req, res) => {
  try {
    const response = await UserService.getAllUser();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getDetailUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "err",
        message: "the user id is required",
      });
    }

  const response = await UserService.getDetailUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
      return res.status(200).json({
        status: "err",
        message: "The token is valid",
      });
    }

    const response = await JwtService.refreshToken(token);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailUser,
  refreshToken,
};
