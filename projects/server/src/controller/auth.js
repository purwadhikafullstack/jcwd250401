const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailer = require("../lib/nodemailer");
const hbs = require("handlebars");
const crypto = require("crypto");
const fs = require("fs"); // Don't forget to import the 'fs' module
const { User } = require("../../models");
const path = require("path");

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
    const verifyCode = crypto.randomBytes(20).toString("hex");
    const username = email.split("@")[0];
    const user = await User.create({
      email,
      username,
      verifyCode,
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
