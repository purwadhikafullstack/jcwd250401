const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("../lib/nodemailer");
const hbs = require("handlebars");
const crypto = require("crypto");
const fs = require("fs"); // Don't forget to import the 'fs' module
const { User, Admin } = require("../models");
const path = require("path");

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

function generateRandomLetterString(length) {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const randomBytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i] % charset.length;
    result += charset.charAt(randomIndex);
  }

  return result;
}

exports.handleRegister = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(400).send({
        message: "User already exists",
      });
    }

    const verifyCode = generateRandomLetterString(6);
    const username = email.split("@")[0];
    const user = await User.create({
      email,
      username,
      verifyCode,
      isVerify: false,
      registBy: "email",
    });

    const templatePath = path.join(__dirname, "../templates/register.html");
    const templateRaw = fs.readFileSync(templatePath, "utf-8");
    const templateCompile = hbs.compile(templateRaw);
    const emailHTML = templateCompile({
      username: user.username,
      verifyCode: user.verifyCode,
      link: `http://localhost:3000/verify?code=${user.verifyCode}`,
    });

    const mailOption = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Registration success, please verify your account.",
      html: emailHTML,
    };

    mailer.sendMail(mailOption, (err, info) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          message: "Internal server error",
        });
      } else {
        console.log("Verification email sent: " + info.response);
        return res.status(201).send({
          message: "User created successfully",
          user,
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error",
    });
  }
};

exports.handleRegisterWithGoogle = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await User.findOne({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res.status(400).send({
        message: "User already exists",
      });
    }

    const verifyCode = generateRandomLetterString(6);
    const username = email.split("@")[0];
    const user = await User.create({
      email,
      username,
      verifyCode,
      isVerify: true,
      registBy: "google",
    });

    return res.status(201).send({
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error",
    });
  }
};

exports.handleVerify = async (req, res) => {
  try {
    const { verifyCode, email } = req.query;

    // Check if the 'verifyCode' and 'email' parameters are provided in the query
    if (!verifyCode || !email) {
      return res.status(400).json({ error: "Verification code or email is missing" });
    }

    const user = await User.findOne({
      where: {
        verifyCode: verifyCode,
        email: email,
      },
    });

    if (user) {
      if (user.isVerify) {
        return res.status(400).json({
          ok: false,
          message: "User is already verified",
        });
      }

      user.isVerify = true;
      await user.save(); // Await the save operation

      return res.status(200).json({
        ok: true,
        message: "User verified successfully",
        email,
      });
    } else {
      // If the code is not valid or no user found, you can send an error response
      return res.status(401).json({
        ok: false,
        message: "Invalid verification code or email",
      });
    }
  } catch (error) {
    // Handle any other errors that might occur during the verification process
    console.error("Error while handling verification:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.handleCreatePassword = async (req, res) => {
  try {
    const { password, email } = req.body;

    // Check if the 'email' and 'password' parameters are provided in the request body
    if (!email || !password) {
      return res.status(400).json({ error: "Email or password is missing" });
    }

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      if (user.password) {
        return res.status(400).json({
          ok: false,
          message: "User already has a password",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      user.password = hashPassword;

      await user.save(); // Await the save operation

      return res.status(200).json({
        ok: true,
        message: "Password created successfully",
        email,
      });
    } else {
      // If no user found, you can send an error response
      return res.status(401).json({
        ok: false,
        message: "Invalid email",
      });
    }
  } catch (error) {
    // Handle any other errors that might occur during the verification process
    console.error("Error while handling password creation:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

exports.handleLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const account = await User.findOne({
      where: {
        [Op.or]: {
          email,
          password,
        },
      },
    });

    if (!account) {
      res.status(401).json({
        ok: false,
        message: "Incorrect email or password",
      });
      return;
    }

    const isValid = await bcrypt.compare(password, account.password);
    if (!isValid) {
      res.status(401).json({
        ok: false,
        message: "Incorrect email or password",
      });
      return;
    }
    const payload = { id: account.id, isVerify: account.isVerify };
    const token = jwt.sign(payload, JWT_SECRET_KEY, {
      expiresIn: "2h",
    });

    const response = {
      token,
      profile: {
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        username: account.username,
        photoProfile: account.photoProfile,
        isVerify: account.isVerify,
      },
    };

    res.status(200).json({
      ok: true,
      data: response,
    });
  } catch (error) {
    res.status(401).json({
      ok: false,
      message: String(error),
    });
  }
};

exports.handleLoginWithGoogle = async (req, res) => {
  const { email } = req.body;

  try {
    const account = await User.findOne({
      where: {
        [Op.or]: {
          email,
        },
      },
    });

    if (!account) {
      res.status(401).json({
        ok: false,
        message: "Incorrect account, Please register your google first!",
      });
      return;
    }

    const payload = { id: account.id, isVerify: account.isVerify };
    const token = jwt.sign(payload, JWT_SECRET_KEY, {
      expiresIn: "2h",
    });

    const response = {
      token,
      profile: {
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        username: account.username,
        photoProfile: account.photoProfile,
        isVerify: account.isVerify,
      },
    };

    res.status(200).json({
      ok: true,
      data: response,
    });
  } catch (error) {
    res.status(401).json({
      ok: false,
      message: String(error),
    });
  }
};

exports.handleForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        ok: false,
        error: "Email is required",
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    if (user.isVerify === false) {
      return res.status(405).json({
        message: "Please verify your account first",
      });
    }

    if (user.registBy === "google") {
      return res.status(403).json({
        message: "This email bound with google services, please login with google",
      });
    }

    const uniqueCode = crypto.randomBytes(20).toString("hex");
    user.uniqueCode = uniqueCode;
    user.uniqueCodeCreatedAt = new Date();
    await user.save();

    const templatePath = path.join(__dirname, "../templates/forgot-password.html");
    const templateRaw = fs.readFileSync(templatePath, "utf-8");
    const templateCompile = hbs.compile(templateRaw);
    const emailHTML = templateCompile({
      username: user.username,
      link: `http://localhost:3000/reset-password?code=${uniqueCode}`,
    });

    const mailOption = {
      from: "RAINS Support Team",
      to: email,
      subject: "Reset your password",
      html: emailHTML,
    };

    mailer.sendMail(mailOption, (err, info) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          message: "Internal server error",
        });
      } else {
        return res.status(200).send({
          ok: true,
          message: "Forgot password request sent successfully",
          user,
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error",
    });
  }
};

exports.handleResetPassword = async (req, res) => {
  try {
    const { uniqueCode, password } = req.body;

    if (!uniqueCode || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ where: { uniqueCode } });

    if (!user) {
      return res.status(400).json({
        message: "Invalid link",
      });
    }

    // Check if the code has expired (e.g., within the last hour)
    const currentTimestamp = Date.now(); // Get the current timestamp in milliseconds
    const codeCreationTimestamp = user.uniqueCodeCreatedAt.getTime(); // Assuming uniqueCodeCreatedAt is a Date object

    const codeValidityDuration = 60 * 60 * 1000; // 1 hour in milliseconds
    if (currentTimestamp - codeCreationTimestamp > codeValidityDuration) {
      return res.status(400).json({
        message: "Reset code has expired, please request again",
      });
    }

    // Code is still valid; proceed to reset the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    user.password = hashPassword;
    user.uniqueCode = null;
    await user.save();

    res.status(200).json({
      message: "Password updated",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.handleSendVerifyEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (user.isVerify) {
      return res.status(400).send({
        message: "This account already verified",
      });
    }

    const verifyCode = generateRandomLetterString(6);
    const username = email.split("@")[0];

    user.verifyCode = verifyCode;
    await user.save();

    const templatePath = path.join(__dirname, "../templates/requestverify.html");
    const templateRaw = fs.readFileSync(templatePath, "utf-8");
    const templateCompile = hbs.compile(templateRaw);
    const emailHTML = templateCompile({
      username: user.username,
      verifyCode: user.verifyCode,
    });

    const mailOption = {
      from: process.env.SMTP_USER,
      to: email,
      subject: "Verify your account",
      html: emailHTML,
    };

    mailer.sendMail(mailOption, (err, info) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          message: "Internal server error",
        });
      } else {
        console.log("Verification email sent: " + info.response);
        return res.status(201).send({
          message: "User created successfully",
          user,
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error",
    });
  }
};

exports.handleAdminRegister = async (req, res) => {
  const { email, password } = req.body;

  try {
   existingAdmin = await Admin.findOne({
    where: {
      email,
    },
  });

  if (existingAdmin) {
    return res.status(400).send({
      message: "Admin already exists",
    });
  
  }
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const admin = await Admin.create({
    email,
    password: hashPassword,
    isWarehouseAdmin: false,
  });

  const response = {
    email: admin.email,
    isWarehouseAdmin: admin.isWarehouseAdmin,
  };
  
  return res.status(201).send({
    message: "Admin created successfully",
    ok: true,
    data: response,
  })

  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error",
    });
  }
};

exports.handleAdminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const account = await Admin.findOne({
      where: {
        [Op.or]: {
          email,
          password,
        },
      },
    });

    if (!account) {
      res.status(401).json({
        ok: false,
        message: "Incorrect email or password",
      });
      return;
    }

    const isValid = await bcrypt.compare(password, account.password);
    if (!isValid) {
      res.status(401).json({
        ok: false,
        message: "Incorrect email or password",
      });
      return;
    }
    const payload = { id: account.id };
    const token = jwt.sign(payload, JWT_SECRET_KEY, {
      expiresIn: "2h",
    });

    const response = {
      token,
      profile: {
        email: account.email,
        isWarehouseAdmin: account.isWarehouseAdmin,
      },
    };

    res.status(200).json({
      ok: true,
      data: response,
    });
  } catch (error) {
    res.status(401).json({
      ok: false,
      message: String(error),
    });
  }
};

exports.handleForgotPasswordAdmin = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        ok: false,
        error: "Email is required",
      });
    }

    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res.status(400).json({
        message: "admin not found",
      });
    }

    const uniqueCode = crypto.randomBytes(20).toString("hex");
    admin.uniqueCode = uniqueCode;
    admin.uniqueCodeCreatedAt = new Date();
    await admin.save();

    const templatePath = path.join(__dirname, "../templates/forgot-password.html");
    const templateRaw = fs.readFileSync(templatePath, "utf-8");
    const templateCompile = hbs.compile(templateRaw);
    const emailHTML = templateCompile({
      username: admin.email,
      link: `http://localhost:3000/reset-password-admin?code=${uniqueCode}`,
    });

    const mailOption = {
      from: "RAINS Support Team",
      to: email,
      subject: "Reset your password",
      html: emailHTML,
    };

    mailer.sendMail(mailOption, (err, info) => {
      if (err) {
        console.log(err);
        return res.status(500).send({
          message: "Internal server error",
        });
      } else {
        return res.status(200).send({
          ok: true,
          message: "Forgot password request sent successfully",
          admin,
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Internal server error",
    });
  }
};

exports.handleResetPasswordAdmin = async (req, res) => {
  try {
    const { uniqueCode, password } = req.body;

    if (!uniqueCode || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const admin = await Admin.findOne({ where: { uniqueCode } });

    if (!admin) {
      return res.status(400).json({
        message: "Invalid link",
      });
    }

    // Check if the code has expired (e.g., within the last hour)
    const currentTimestamp = Date.now(); // Get the current timestamp in milliseconds
    const codeCreationTimestamp = admin.uniqueCodeCreatedAt.getTime(); // Assuming uniqueCodeCreatedAt is a Date object

    const codeValidityDuration = 60 * 60 * 1000; // 1 hour in milliseconds
    if (currentTimestamp - codeCreationTimestamp > codeValidityDuration) {
      return res.status(400).json({
        message: "Reset code has expired, please request again",
      });
    }

    // Code is still valid; proceed to reset the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    admin.password = hashPassword;
    admin.uniqueCode = null;
    await admin.save();

    res.status(200).json({
      message: "Password updated",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
