const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

exports.validateToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    res.status(401).json({
      ok: false,
      message: "Please login first",
    });
    return;
  }

  try {
    token = token.split(" ")[1];
    if (!token) {
      res.status(401).json({
        ok: false,
        message: "Please login first",
      });
      return;
    }
    const payload = jwt.verify(token, JWT_SECRET_KEY);
    if (!payload) {
      res.status(401).json({
        ok: false,
        message: "Failed to get authorization data",
      });
      return;
    }

    req.user = payload;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      // JWT is malformed
      res.status(403).json({
        ok: false,
        message: "Please login first.",
      });
    } else if (error.name === "TokenExpiredError") {
      // JWT has expired
      res.status(403).json({
        ok: false,
        message: "Your session has expired, please login again",
      });
    } else {
      // Other errors
      res.status(403).json({
        ok: false,
        message: String(error),
      });
    }
  }
};

exports.checkRoleSuperAdmin = (req, res, next) => {
  if (req.user.isWarehouseAdmin === false) {
    next();
    return;
  }
  res.status(401).json({
    ok: false,
    message: "Permission Denied",
  });
};

exports.checkRoleWarehouseAdmin = (req,res, next) => { 
  if (req.user.isWarehouseAdmin === true) {
    next();
    return;
  }
  res.status(401).json({
    ok: false,
    message: "Permission Denied",
  });
}


// exports.checkRoleUser = (req, res, next) => {

exports.checkRoleUserVerify= (req, res, next) => {
  if (req.user.isVerify === true) {
    next();
    return;
  }

  res.status(401).json({
    ok: false,
    message: "Your account is not verified yet. Please check your email to verify your account",
  });
};
