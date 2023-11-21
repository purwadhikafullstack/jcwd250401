const { User, Admin } = require("../models");
const bcrypt = require("bcrypt");

exports.getAllUser = async (req, res) => {
  const { size = 5, page = 1, sort = "createdAt", order = "DESC" } = req.query;
  const limit = parseInt(size);
  const offset = (parseInt(page) - 1) * limit;
  try {
    const orderClause = [[sort, order]];
    const users = await User.findAll({
      order: orderClause,
      limit,
      offset,
    });

    return res.status(200).json({
      ok: true,
      message: "Get all user successfully",
      detail: users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      detail: String(error),
    });
  }
};

exports.getAllAdmin = async (req, res) => {
  const { size = 5, page = 1, sort = "createdAt", order = "desc", isWarehouseAdmin } = req.query;
  const limit = parseInt(size);
  const offset = (parseInt(page) - 1) * limit;
  try {
    const orderClause = [[sort, order]];

    let whereClause = {};
    if (isWarehouseAdmin !== null) {
      whereClause = { isWarehouseAdmin: isWarehouseAdmin === "true" };
    }
    const admins = await Admin.findAll({
      where: whereClause,
      order: orderClause,
      limit,
      offset,
    });

    return res.status(200).json({
      ok: true,
      message: "Get all admin successfully",
      detail: admins,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      detail: String(error),
    });
  }
};

exports.updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, isWarehouseAdmin } = req.body;
  const salt = await bcrypt.genSalt(10);
  try {
    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({
        ok: false,
        message: "Admin not found",
      });
    }

    if (email) {
      const existingAdmin = await Admin.findOne({ where: { email, username } });
      if (existingAdmin) {
        return res.status(400).json({
          ok: false,
          message: "Admin with this email & username already exists",
        });
      }
      admin.email = email;
    }

    admin.username = username;
    isWarehouseAdmin ? (admin.isWarehouseAdmin = isWarehouseAdmin) : admin.isWarehouseAdmin;
    if (password !== undefined && password !== null && password !== "") {
      const hashPassword = await bcrypt.hash(password, salt);
      admin.password = hashPassword;
    }
    await admin.save();

    return res.status(200).json({
      ok: true,
      message: "Update admin successfully",
      detail: admin,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      detail: String(error),
    });
  }
};

exports.deleteAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({
        ok: false,
        message: "Admin not found",
      });
    }

    await admin.destroy();
    return res.status(200).json({
      ok: true,
      message: "Delete admin successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      detail: String(error),
    });
  }
};
