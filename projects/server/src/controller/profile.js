const { User, Admin } = require("../models");
const bcrypt = require("bcrypt");

exports.handleUpdateProfile = async (req, res) => {
  const { username } = req.params;
  const { userName, firstName, lastName, email, token } = req.body;

  try {
    const account = await User.findOne({
      where: {
        username,
      },
    });

    if (!account) {
      return res.status(404).json({
        ok: false,
        msg: "Account not found",
      });
    }

    if (userName) {
      const existingUser = await User.findOne({ where: { userName } });

      if (existingUser && existingUser.username !== account.username) {
        // This checks if the username of the existing user is different from the username 
        // of the current user (the one trying to update their username)
        return res.status(400).json({
          ok: false,
          msg: "Username already exists",
        });
      }

      account.username = userName;
    }
    if (firstName) {
      account.firstName = firstName;
    }
    if (lastName) {
      account.lastName = lastName;
    }
    if (email) {
      account.email = email;
    }

    if (req.file) {
      account.photoProfile = req.file.filename;
    } else {
      account.photoProfile = account.photoProfile;
    }

    await account.save();

    const response = {
      token,
      profile: {
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        username: account.username,
        photoProfile: account.photoProfile,
      },
    };

    res.status(200).json({
      ok: true,
      message: "Profile updated successfully",
      data: response,
    });
    
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Internal server error",
      detail: String(error),
    });
  }
};

exports.handleGetSingleUser = async (req, res) => {
  const { username } = req.params;

  try {
    const account = await User.findOne({
      where: {
        username,
      },
    });

    if (!account) {
      return res.status(404).json({
        ok: false,
        message: "Account not found",
      });
    }

    res.status(200).json({
      ok: true,
      message: "Get single user successfully",
      detail: account,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Internal server error",
      detail: String(error),
    });
  }
};

exports.handleUpdatePassword = async (req, res) => {
  const { username } = req.params;
  const { password, newPassword } = req.body;

  try {
    const account = await User.findOne({ where: { username } });
    const salt = await bcrypt.genSalt(10);

    if (!account) {
      return res.status(404).json({
        ok: false,
        message: "Account not found",
      });
    }

    if (account.registBy === "google") {
      return res.status(400).json({
        ok: false,
        message: "You can't change password because you are registered with google",
      });
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(400).json({
        ok: false,
        message: "Current password is incorrect",
      });
    }

    if (newPassword !== undefined && newPassword !== "" && newPassword !== null) {
      const hash = await bcrypt.hash(newPassword, salt);
      account.password = hash;
    }

    await account.save();
    res.status(200).json({
      ok: true,
      message: "Password updated successfully",
      detail: account,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Internal server error",
      detail: String(error),
    });
  }
};


exports.handleGetSingleAdmin = async (req, res) => {
  const { username } = req.params;

  try {
    const account = await Admin.findOne({
      where: {
        username,
      },
    });

    if (!account) {
      return res.status(404).json({
        ok: false,
        msg: "Account not found",
      });
    }

    const response = [
      {
        email: account.email,
        username: account.username,
        photoProfile: account.photoProfile,
        isWarehouseAdmin: account.isWarehouseAdmin,
      },
    ]
    
    res.status(200).json({
      ok: true,
      message: "Get admin profile successfully",
      detail: response,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Internal server error",
      detail: String(error),
    });
  }
};