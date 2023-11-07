const { User } = require("../models");
const bcrypt = require("bcrypt");

exports.handleUpdateProfile = async (req, res) => {
  const { id } = req.params;
  const { username, firstName, lastName, email } = req.body;

  try {
    const account = await User.findByPk(id);

    if (!account) {
      return res.status(404).json({
        ok: false,
        msg: "Account not found",
      });
    }

    if (username) {
      account.username = username;
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
    res.status(200).json({
      ok: true,
      message: "Profile updated successfully",
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

exports.handleGetSingleUser = async (req, res) => {
  const { id } = req.params;

  try {
    const account = await User.findByPk(id);

    if (!account) {
      return res.status(404).json({
        ok: false,
        msg: "Account not found",
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
  const { id } = req.params;
  const { password } = req.body;

  try {
    const account = await User.findByPk(id);
    const salt = await bcrypt.genSalt(10);

    if (!account) {
      return res.status(404).json({
        ok: false,
        message: "Account not found",
      });
    }

    if (password !== undefined && password !== "" && password !== null) {
      const hash = await bcrypt.hash(password, salt);
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
