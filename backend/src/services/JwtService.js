const jwt = require("jsonwebtoken");
require("dotenv").config();
const generalAccessToken = async (payload) => {
  const access_token = jwt.sign({ payload }, "access_token", {
    expiresIn: process.env.ACCESS_TOKEN_LIFE,
  });

  return access_token;
};

const generateRefreshToken = async (payload) => {
  const refresh_token = jwt.sign({ payload }, "refresh_token", {
    expiresIn: process.env.REFRESH_TOKEN_LIFE,
  });

  return refresh_token;
};


const refreshToken = async (token) => {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.REFRESH_TOKEN, async (err, user) => {
        if (err) {
          resolve({
            status: "err",
            message: "Token refresh is not valid",
          });
        }
        const { payload } = user;
        const access_token = await generalAccessToken({id: payload?.id, isAdmin: payload?.isAdmin});
        console.log('access_token:',access_token);
        resolve({
          status: "OK",
          message: "success",
          access_token,
        });

      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  generalAccessToken,
  generateRefreshToken,
  refreshToken,
};
