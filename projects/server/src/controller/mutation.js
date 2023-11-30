const { Op, literal } = require("sequelize");
const { Mutation, Product, Warehouse, Admin, ProductImage, Category, sequelize, Journal } = require("../models");

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
    const { page = 1, size = 5, sort = "id", order = "DESC", search, warehouseId = null, month = null } = req.query;
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

    if (mutationQuantity <= 0) {
      return res.status(400).json({
        ok: false,
        message: "Mutation quantity must be greater than 0",
      });
    }

    if (warehouseId === destinationWarehouseId) {
      return res.status(400).json({
        ok: false,
        message: "Source and destination warehouse cannot be the same",
      });
    }

    const isExistMutation = await Mutation.findOne({
      where: {
        adminId,
        warehouseId,
        destinationWarehouseId,
        productId,
        mutationQuantity,
        status: "pending",
      },
      transaction: t,
    });

    if (isExistMutation) {
      await t.rollback();
      return res.status(400).json({
        ok: false,
        message: "Mutation with the same quantity already exists, please wait for it to be processed",
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
    if (currentStockAtSourceWarehouse < mutationQuantity) {
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
        previousStock: currentStockAtSourceWarehouse,
        mutationType: "subtract",
        adminId,
        stock: latestMutation.stock,
        status: "pending",
        isManual: true,
      },
      { transaction: t }
    );

    const mutationJournal = await Journal.create(
      {
        mutationId: mutation.id,
        productId: mutation.productId,
        warehouseId: mutation.warehouseId,
        destinationWarehouseId: mutation.destinationWarehouseId,
        mutationQuantity: mutation.mutationQuantity,
        previousStock: mutation.previousStock,
        mutationType: mutation.mutationType,
        adminId: mutation.adminId,
        stock: mutation.stock,
        status: mutation.status,
        isManual: mutation.isManual,
      },
      { transaction: t }
    );

    res.status(200).json({
      ok: true,
      message: "Mutation created successfully",
      detail: mutation,
      journal: mutationJournal,
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
  const { mutationId, action } = req.body;

  try {
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

    // get Journal
    const updatedMutationJournal = await Journal.findOne({
      where: {
        productId: mutation.productId,
        warehouseId: mutation.warehouseId,
        destinationWarehouseId: mutation.destinationWarehouseId,
        createdAt: mutation.createdAt,
      },
      order: [["createdAt", "DESC"]],
      limit: 1,
      transaction: t,
    });

    if (!updatedMutationJournal) {
      await t.rollback();
      return res.status(404).json({
        ok: false,
        message: "Journal not found",
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
      // get the latest mutation from the source warehouse to check if there is enough stock
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
        attributes: ["stock", "id"],
        transaction: t,
      });

      // check if the latest mutation exists and if there is enough stock
      if (findLatestMutationSourceWarehouse && findLatestMutationSourceWarehouse.stock >= mutation.mutationQuantity) {
        // update the latest mutation stock from the source warehouse
        const updatedStock = findLatestMutationSourceWarehouse.stock - mutation.mutationQuantity;
        // create a new mutation for the source warehouse to update the stock
        const newMutationForSourceWarehouse = await Mutation.create({
          productId,
          warehouseId,
          destinationWarehouseId: mutation.destinationWarehouseId,
          mutationQuantity: mutation.mutationQuantity,
          previousStock: mutation.previousStock,
          mutationType: "subtract",
          adminId: mutation.adminId,
          stock: updatedStock,
          status: "success",
          isManual: true,
        });
        await newMutationForSourceWarehouse.save({ transaction: t });

        // get the latest mutation from the destination warehouse in order to update the stock
        const existingDestinationWarehouseMutation = await Mutation.findOne({
          where: {
            productId,
            warehouseId: mutation.destinationWarehouseId,
            status: "success",
          },
          order: [["createdAt", "DESC"]],
          limit: 1,
          attributes: ["stock", "id"],
          transaction: t,
        });

        const stockForDestinationWarehouse = mutation.mutationQuantity;

        // check if the latest mutation from the destination warehouse exists
        if (existingDestinationWarehouseMutation) {
          // update the latest mutation stock from the destination warehouse
          const updatedStock = existingDestinationWarehouseMutation.stock + stockForDestinationWarehouse;
          const updatedMutation = await Mutation.create({
            productId,
            warehouseId: mutation.warehouseId,
            destinationWarehouseId: mutation.destinationWarehouseId,
            mutationQuantity: stockForDestinationWarehouse,
            previousStock: existingDestinationWarehouseMutation.stock,
            mutationType: "add",
            adminId: mutation.adminId,
            stock: updatedStock,
            status: "success",
            isManual: true,
          });

          // update the latest mutation journal
          updatedMutationJournal.stock = updatedStock;
          updatedMutationJournal.status = "success";
          updatedMutationJournal.adminId = mutation.adminId;
          updatedMutationJournal.mutationType = "add";
          await updatedMutationJournal.save({ transaction: t });

          await t.commit();
          return res.status(200).json({
            ok: true,
            message: "Success updating stock at destination warehouse",
            detail: updatedMutation,
            journal: updatedMutationJournal,
          });
        } else {
          // create a new mutation at destination warehouse
          const updatedMutation = await Mutation.create({
            productId,
            warehouseId: mutation.destinationWarehouseId,
            destinationWarehouseId: mutation.destinationWarehouseId,
            mutationQuantity: stockForDestinationWarehouse,
            previousStock: 0,
            mutationType: "add",
            adminId: mutation.adminId,
            stock: stockForDestinationWarehouse,
            status: "success",
            isManual: true,
          });

          // update the latest mutation journal
          updatedMutationJournal.stock = stockForDestinationWarehouse;
          updatedMutationJournal.status = "success";
          updatedMutationJournal.adminId = mutation.adminId;
          updatedMutationJournal.mutationType = "add";
          await updatedMutationJournal.save({ transaction: t });

          await t.commit();
          return res.status(200).json({
            ok: true,
            message: "Success updating stock at destination warehouse",
            detail: updatedMutation,
            journal: updatedMutationJournal,
          });
        }
      } else {
        mutation.status = "failed";
        await mutation.save({ transaction: t });

        // update the latest mutation journal
        updatedMutationJournal.stock = mutation.stock;
        updatedMutationJournal.status = "failed";
        await updatedMutationJournal.save({ transaction: t });

        await t.commit();
        return res.status(400).json({
          ok: false,
          message: "Failed, not enough stock at source warehouse",
          detail: findLatestMutationSourceWarehouse,
        });
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
