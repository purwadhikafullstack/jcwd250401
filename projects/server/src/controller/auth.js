const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("../lib/nodemailer");
const hbs = require("handlebars");
const crypto = require("crypto");
const fs = require("fs"); // Don't forget to import the 'fs' module
const { User } = require("../models");
const path = require("path");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

function generateRandomLetterString(length) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
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
}

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

    console.log(account);

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