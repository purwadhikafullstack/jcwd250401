const { Op, literal } = require("sequelize");
const { Mutation, Product, Warehouse, Admin, ProductImage, Category, sequelize } = require("../models");

exports.getTotalStockByWarehouseProductId = async (req, res) => {
  const { warehouseId, productId } = req.params;
  try {
    if (!warehouseId || !productId) {
      return res.status(400).json({
        ok: false,
        message: "Missing required parameters",
      });
    }

    const latestMutation = await Mutation.findOne({
      where: {
        productId,
        warehouseId,
      },
      order: [["createdAt", "DESC"]],
      limit: 1,
      attributes: ["stock"],
    });

    res.status(200).json({
      ok: true,
      message: "Mutation retrieved successfully",
      detail: latestMutation,
    });
  } catch (error) {
    console.error("Error retrieving mutation:", error);
    res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

exports.getAllMutations = async (req, res) => {
  try {
    const { page = 1, size = 5, sort = "createdAt", order = "DESC", search, warehouseId = null, month = null } = req.query;
    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    const whereCondition = {};

    if (search) {
      whereCondition[Op.or] = [{ productId: { [Op.like]: `%${search}%` } }, { mutationType: { [Op.like]: `%${search}%` } }];
    }

    // Filter by warehouseId if provided
    if (warehouseId) {
      whereCondition.warehouseId = warehouseId;
    }

    if (month) {
      whereCondition.createdAt = {
        [Op.and]: [
          // Filter by the current month
          literal(`MONTH(createdAt) = ${parseInt(month)}`), // Required: Filter by the current month
          literal(`YEAR(createdAt) = YEAR(NOW())`), // Optional: Filter by the current year
        ],
      };
    }
    const mutations = await Mutation.findAll({
      where: whereCondition,
      limit,
      offset,
      order: [[sort, order]],
      include: [
        {
          model: Product,
          attributes: ["id", "name"],
          include: [
            {
              model: Category,
              as: "Categories",
              attributes: ["id", "name"],
            },
            {
              model: ProductImage,
              as: "productImages",
              attributes: ["id", "productId", "imageUrl"],
            },
          ],
        },
        {
          model: Warehouse,
          attributes: ["id", "name"],
        },
        {
          model: Admin,
          attributes: ["id", "username"],
        },
      ],
    });

    res.status(200).json({
      ok: true,
      message: "Mutations retrieved successfully",
      detail: mutations,
    });
  } catch (error) {
    console.error("Error retrieving mutation:", error);
    res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

exports.getPendingMuntation = async (req, res) => {
  try {
    const pendingMutations = await Mutation.findAll({
      where: {
        status: "pending",
      },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Product,
          attributes: ["id", "name"],
          include: [
            {
              model: Category,
              as: "Categories",
              attributes: ["id", "name"],
            },
            {
              model: ProductImage,
              as: "productImages",
              attributes: ["id", "productId", "imageUrl"],
            },
          ],
        },
      ],
    });

    if (!pendingMutations || pendingMutations.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "No pending mutations found!",
      });
    }

    res.status(200).json({
      ok: true,
      message: "Pending Mutations retrieved successfully",
      detail: pendingMutations,
    });
  } catch (error) {
    console.error("Error retrieving mutation:", error);
    res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

exports.createManualStockMutation = async (req, res) => {
  const { adminId, warehouseId, destinationWarehouseId, productId, mutationQuantity } = req.body;
  const t = await sequelize.transaction();

  try {
    if (!adminId || !warehouseId || !destinationWarehouseId || !productId || !mutationQuantity) {
      return res.status(400).json({
        ok: false,
        message: "Missing required parameters",
      });
    }

    // check if the admin, source warehouse and destination warehouse exists
    const admin = await Admin.findByPk(adminId, { transaction: t });
    const sourceWarehouse = await Warehouse.findByPk(warehouseId, { transaction: t });
    const detinantionWarehouse = await Warehouse.findByPk(destinationWarehouseId, { transaction: t });

    if (!admin || !sourceWarehouse || !detinantionWarehouse) {
      return res.status(404).json({
        ok: false,
        message: "Admin, source warehouse or destination warehouse not found",
      });
    }

    // get the latest mutation
    const latestMutation = await Mutation.findOne({
      where: {
        productId,
        warehouseId,
        status: "success",
      },
      order: [["createdAt", "DESC"]],
      limit: 1,
      attributes: ["stock"],
      transaction: t,
    });

    // get the latest mutation from the source warehouse to check if there is enough stock
    const currentStockAtSourceWarehouse = latestMutation ? latestMutation.stock : 0;
    if (currentStockAtSourceWarehouse <= mutationQuantity) {
      await t.rollback();
      return res.status(400).json({
        ok: false,
        message: "Insufficient stock at the source warehouse",
      });
    }

    // create the mutation
    const mutation = await Mutation.create(
      {
        productId,
        warehouseId,
        destinationWarehouseId,
        mutationQuantity,
        mutationType: "subtract",
        adminId,
        status: "pending",
        isManual: true,
      },
      { transaction: t }
    );

    res.status(200).json({
      ok: true,
      message: "Mutation created successfully",
      detail: mutation,
    });

    await t.commit();
  } catch (error) {
    await t.rollback();
    console.error("Error creating mutation:", error);
    res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

exports.processStockMutationByWarehouse = async (req, res) => {
  const t = await sequelize.transaction();
  const { warehouseId, mutationId, action } = req.body;

  try {
    // check if the warehouse exists
    const warehouse = await Warehouse.findByPk(warehouseId, { transaction: t });

    if (!warehouse) {
      await t.rollback();
      return res.status(404).json({
        ok: false,
        message: "Warehouse not found",
      });
    }

    // check if the mutation with status pending exists
    const mutation = await Mutation.findOne({
      where: {
        id: mutationId,
        status: "pending",
      },
      transaction: t,
    });

    if (!mutation) {
      await t.rollback();
      return res.status(404).json({
        ok: false,
        message: "Mutation not found",
      });
    }

    if (action === "process") {
      mutation.status = "processing";
      await mutation.save({ transaction: t });
    } else if (action === "cancel") {
      mutation.status = "cancelled";
      await mutation.save({ transaction: t });
      await t.commit();
      return res.status(200).json({
        ok: true,
        message: "Mutation cancelled successfully",
        detail: mutation,
      });
    } else {
      await t.rollback();
      return res.status(400).json({
        ok: false,
        message: "Invalid action",
      });
    }

    if (action === "process") {
      // get the latest mutation from the source warehouse
      const productId = mutation.productId;
      const warehouseId = mutation.warehouseId;
      const findLatestMutationSourceWarehouse = await Mutation.findOne({
        where: {
          productId,
          warehouseId,
          status: "success", // optionally add status: "success"
        },
        order: [["createdAt", "DESC"]],
        limit: 1,
        attributes: ["stock"],
        transaction: t,
      });

      // check if the latest mutation exists
      if (findLatestMutationSourceWarehouse) {
        // update the latest mutation stock from the source warehouse
        const updatedStock = findLatestMutationSourceWarehouse.stock - mutation.mutationQuantity;
        findLatestMutationSourceWarehouse.stock = updatedStock;
        await findLatestMutationSourceWarehouse.save({ transaction: t });

        // get the latest mutation from the destination warehouse
        const existingDestinationWarehouseMutation = await Mutation.findOne({
          where: {
            productId,
            warehouseId: mutation.destinationWarehouseId,
            status: "success",
          },
          order: [["createdAt", "DESC"]],
          limit: 1,
          attributes: ["stock"],
          transaction: t,
        });

        const stockForDestinationWarehouse = mutation.mutationQuantity;

        // check if the latest mutation from the destination warehouse exists
        if (existingDestinationWarehouseMutation) {
          // update the latest mutation stock from the destination warehouse by creating a new mutation
          const updatedStock = existingDestinationWarehouseMutation.stock + stockForDestinationWarehouse;
          await Mutation.create({
            productId,
            warehouseId: mutation.destinationWarehouseId,
            destinationWarehouseId: mutation.destinationWarehouseId,
            mutationQuantity: stockForDestinationWarehouse,
            mutationType: "add",
            adminId: mutation.adminId,
            stock: updatedStock,
            status: "success",
            isManual: mutation.isManual,
          });

          await mutation.save({ transaction: t });
          await t.commit();
          return res.status(200).json({
            ok: true,
            message: "Success updating stock at destination warehouse",
            description: `Updated stock from ${findLatestMutationSourceWarehouse.stock} to ${updatedStock}`,
            detail: mutation,
          });
        } else {
          // create a new mutation in the destination warehouse to update the stock if it does not exist
          const stock = await Mutation.create(
            {
              productId,
              warehouseId: mutation.destinationWarehouseId,
              destinationWarehouseId: mutation.destinationWarehouseId,
              mutationQuantity: stockForDestinationWarehouse,
              mutationType: "add",
              adminId: mutation.adminId,
              stock: stockForDestinationWarehouse,
              status: "success",
              isManual: mutation.isManual,
            },
            { transaction: t }
          );

          await mutation.save({ transaction: t });
          await t.commit();
          return res.status(200).json({
            ok: true,
            message: "Success updating stock and creating new mutation at destination warehouse",
            description: `Updated stock from 0 to ${stockForDestinationWarehouse}`,
            detail: stock,
          });
        }
      }
    }
  } catch (error) {
    await t.rollback();
    console.error("Error processing mutation:", error);
    res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};
