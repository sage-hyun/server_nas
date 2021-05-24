const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;
require("dotenv").config();

const verifyToken = (req, res, next) => {
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
      /* 앞에 Bearer과 하나의 공백을 빼고 토큰 값만 파싱 ! */
      token = req.headers.authorization.split(' ')[1];
    } /* 아래 부분은 혹시 쿠키에 토큰이 있는 경우를 대비해 처리 ! */
     else if (req.cookies.token){
      token = req.cookies.token;
    }

    const decoded = jwt.verify(token, SECRET_KEY);

    if (decoded) {
      req.email = decoded.email;
      req.familyId = decoded.familyId;
      next();
    } else {
      res.status(401).json({ error: "unauthorized" });
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "token expired" });
  }
};

exports.verifyToken = verifyToken;
