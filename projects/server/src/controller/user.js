const { Op } = require("sequelize");
const { User, Admin, Warehouse } = require("../models");
const bcrypt = require("bcrypt");

exports.getAllUser = async (req, res) => {
  const { size = 5, page = 1, sort = "createdAt", order = "DESC", search } = req.query;
  const limit = parseInt(size);
  const offset = (parseInt(page) - 1) * limit;

  try {
    const orderClause = [[sort, order]];
    let whereClause = {};

    if (search) {
      whereClause = {
        ...whereClause,
        [Op.or]: [{ username: { [Op.like]: `%${search}%` } }, { email: { [Op.like]: `%${search}%` } }],
      };
    }

    const users = await User.findAll({
      where: whereClause,
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
  const { size = 5, page = 1, sort = "createdAt", order = "desc", isWarehouseAdmin = null, search } = req.query;
  const limit = parseInt(size);
  const offset = (parseInt(page) - 1) * limit;
  try {
    let orderClause = [[sort, order]];

    let whereClause = {};
    if (isWarehouseAdmin !== null && isWarehouseAdmin !== undefined && isWarehouseAdmin !== "") {
      whereClause = { isWarehouseAdmin: isWarehouseAdmin === "true" };
    }

    if (search) {
      whereClause = {
        ...whereClause,
        [Op.or]: [{ username: { [Op.like]: `%${search}%` } }, { email: { [Op.like]: `%${search}%` } }],
      };
    }

    if (sort === "isWarehouseAdmin") {
      orderClause = [["username", order]];
    }

    const admins = await Admin.findAll({
      where: whereClause,
      order: orderClause,
      limit,
      offset,
      include: [
        {
          model: Warehouse,
          attributes: ["id", "name", "adminId"],
        },
      ],
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
  const { username, email, password, isWarehouseAdmin, token } = req.body;
  const salt = await bcrypt.genSalt(10);
  try {
    const admin = await Admin.findByPk(id);
    if (!admin) {
      return res.status(404).json({
        ok: false,
        message: "Admin not found",
      });
    }

    // Check if email already exists for other admins, only if the email is being updated
    if (email !== admin.email) {
      const existingAdminWithEmail = await Admin.findOne({ where: { email } });
      if (existingAdminWithEmail && existingAdminWithEmail.id !== id) {
        return res.status(400).json({
          ok: false,
          message: "Admin with this email already exists",
        });
      }
    }

    // Check if username already exists for other admins, only if the username is being updated
    if (username !== admin.username) {
      const existingAdminWithUsername = await Admin.findOne({ where: { username } });
      if (existingAdminWithUsername && existingAdminWithUsername.id !== id) {
        return res.status(400).json({
          ok: false,
          message: "Admin with this username already exists",
        });
      }
    }
    admin.email = email;
    admin.username = username;
    admin.isWarehouseAdmin = isWarehouseAdmin ? isWarehouseAdmin : admin.isWarehouseAdmin;

    if (password !== undefined && password !== null && password !== "") {
      const hashPassword = await bcrypt.hash(password, salt);
      admin.password = hashPassword;
    }
    await admin.save();

    const response = {
      profile: {
        username: admin.username,
        email: admin.email,
        isWarehouseAdmin: admin.isWarehouseAdmin,
      },
      token,
    };

    return res.status(200).json({
      ok: true,
      message: "Update admin successfully",
      data: response,
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

    const warehouseAssigned = await Warehouse.findOne({ where: { adminId: id } });
    if (warehouseAssigned) {
      return res.status(400).json({
        ok: false,
        message: "Cannot delete admin who is assigned to a warehouse, please unassign first",
      });
    }

    await admin.destroy();
    return res.status(200).json({
      ok: true,
      message: "Delete admin successfully",
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

exports.getSingleAdminWarehouse = async (req, res) => {
  const { username, email } = req.params;

  try {
    const admin = await Admin.findOne({
      where: {
        username,
        email,
        isWarehouseAdmin: true,
      },
    });

    if (!admin) {
      return res.status(404).json({
        ok: false,
        message: "Admin Warehouse not found",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Get admin warehouse successfully",
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

exports.getSingleSuperAdmin = async (req, res) => {
  const { username, email } = req.params;

  try {
    const admin = await Admin.findOne({
      where: {
        username,
        email,
        isWarehouseAdmin: false,
      },
    });

    if (!admin) {
      return res.status(404).json({
        ok: false,
        message: "Super Admin not found",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Get super admin successfully",
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
