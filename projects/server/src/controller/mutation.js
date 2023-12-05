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
        status: "success",
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
          // Optional: Combine multiple conditions
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

exports.getPendingMutation = async (req, res) => {
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

exports.getAllMutationsJournal = async (req, res) => {
  try {
    const { page = 1, size = 5, sort = "id", order = "DESC", search, warehouseId = null, destinationWarehouseId = null, month = null, status } = req.query;
    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    const whereCondition = {};
    // whereCondition.status = "pending";

    if (search) {
      whereCondition[Op.or] = [{ productId: { [Op.like]: `%${search}%` } }];
    }

    if (warehouseId) {
      whereCondition[Op.or] = [{ warehouseId }, { destinationWarehouseId: warehouseId }];
    }

    if (destinationWarehouseId) {
      whereCondition.destinationWarehouseId = destinationWarehouseId;
    }

    if (month) {
      whereCondition.createdAt = {
        [Op.and]: [literal(`MONTH(createdAt) = ${parseInt(month)}`), literal(`YEAR(createdAt) = YEAR(NOW())`)],
      };
    }

    if (status) {
      whereCondition.status = status;
    }

    const mutationsJournal = await Journal.findAll({
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

    if (!mutationsJournal || mutationsJournal.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "No mutations found!",
      });
    }

    // add source and destination warehouse names to each mutation
    const mutationsJournalWithNames = await Promise.all(
      mutationsJournal.map(async (mutation) => {
        const sourceWarehouse = await Warehouse.findOne({
          where: {
            id: mutation.warehouseId,
          },
          attributes: ["id", "name", "adminId"],
        });

        const destinationWarehouse = await Warehouse.findOne({
          where: {
            id: mutation.destinationWarehouseId,
          },
          attributes: ["id", "name", "adminId"],
        });

        return {
          ...mutation.toJSON(),
          sourceWarehouseData: sourceWarehouse
            ? {
                id: sourceWarehouse.id,
                name: sourceWarehouse.name,
                adminId: sourceWarehouse.adminId,
              }
            : null,
          destinationWarehouseData: destinationWarehouse
            ? {
                id: destinationWarehouse.id,
                name: destinationWarehouse.name,
                adminId: destinationWarehouse.adminId,
              }
            : null,
        };
      })
    );

    // calculate pagination data
    const totalData = mutationsJournalWithNames.length;
    const totalPage = Math.ceil(totalData / limit);

    res.status(200).json({
      ok: true,
      message: "Mutations journal retrieved successfully",
      pagination: {
        totalData,
        totalPage,
      },
      detail: {
        data: mutationsJournalWithNames,
      },
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
  const { adminId, warehouseId, destinationWarehouseId, productId, date } = req.body;
  let { mutationQuantity } = req.body;
  const t = await sequelize.transaction();
  mutationQuantity = parseInt(mutationQuantity);
  console.log(adminId, warehouseId, destinationWarehouseId, productId, date, mutationQuantity);

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
    // const newStockAtSourceWarehouse = currentStockAtSourceWarehouse - mutationQuantity;

    const sourceWarehouseName = await Warehouse.findOne({
      where: {
        id: warehouseId,
      },
      attributes: ["id", "name"],
      transaction: t,
    });

    const destinationWarehouseName = await Warehouse.findOne({
      where: {
        id: destinationWarehouseId,
      },
      attributes: ["id", "name"],
      transaction: t,
    });

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
        stock: currentStockAtSourceWarehouse,
        status: "pending",
        isManual: true,
        description: `Warehouse Admin mutation, ${sourceWarehouseName.name} -> ${destinationWarehouseName.name}`,
        createdAt: date,
        updatedAt: date,
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
        description: mutation.description,
        createdAt: mutation.createdAt,
        updatedAt: mutation.updatedAt,
      },
      { transaction: t }
    );

    await t.commit();
    res.status(200).json({
      ok: true,
      message: "Mutation created successfully",
      detail: {
        mutation,
      },
      journal: mutationJournal,
    });
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
        message: "Mutation with status pending not found",
      });
    }

    // get the latest mutation journal
    const updatedMutationJournal = await Journal.findOne({
      where: {
        productId: mutation.productId,
        warehouseId: mutation.warehouseId,
        destinationWarehouseId: mutation.destinationWarehouseId,
        createdAt: mutation.createdAt,
        status: "pending",
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
      updatedMutationJournal.status = "cancelled";
      await mutation.save({ transaction: t });
      await updatedMutationJournal.save({ transaction: t });
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

      // get warehouse name for description
      const sourceWarehouseName = await Warehouse.findOne({
        where: {
          id: mutation.warehouseId,
        },
        attributes: ["id", "name"],
        transaction: t,
      });

      // check if the latest mutation exists and if there is enough stock at the source warehouse, also check if the stock is still equal to the mutation quantity
      if (findLatestMutationSourceWarehouse && findLatestMutationSourceWarehouse.stock >= mutation.mutationQuantity && findLatestMutationSourceWarehouse.stock === mutation.previousStock) {
        // update latest pending mutation stock and status
        const updatedStock = findLatestMutationSourceWarehouse.stock - mutation.mutationQuantity;
        mutation.status = "success";
        mutation.stock = updatedStock;
        await mutation.save({ transaction: t });

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
          // create a new mutation at destination warehouse
          const updatedMutation = await Mutation.create({
            productId,
            warehouseId: mutation.destinationWarehouseId,
            destinationWarehouseId: mutation.destinationWarehouseId,
            mutationQuantity: stockForDestinationWarehouse,
            previousStock: existingDestinationWarehouseMutation.stock,
            mutationType: "add",
            adminId: mutation.adminId,
            stock: updatedStock,
            status: "success",
            isManual: true,
            description: `Warehouse Admin mutation, Get new stock from ${sourceWarehouseName.name}`,
          });

          // update the latest status in the mutation journal
          updatedMutationJournal.status = "success";
          await updatedMutationJournal.save({ transaction: t });

          // create a new mutation journal at destination warehouse
          const newMutationForDestinationWarehouse = await Journal.create({
            mutationId: updatedMutation.id,
            productId,
            warehouseId: mutation.destinationWarehouseId,
            destinationWarehouseId: mutation.destinationWarehouseId,
            mutationQuantity: stockForDestinationWarehouse,
            previousStock: existingDestinationWarehouseMutation.stock,
            mutationType: "add",
            adminId: mutation.adminId,
            stock: updatedStock,
            status: "success",
            isManual: true,
            description: `Warehouse Admin mutation, Get new stock from ${sourceWarehouseName.name}`,
          });

          await t.commit();
          return res.status(200).json({
            ok: true,
            message: "Success updating stock at destination warehouse",
            detail: updatedMutation,
            journal: newMutationForDestinationWarehouse,
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
            description: `Warehouse Admin mutation, Get new stock from ${sourceWarehouseName.name}`,
          });

          // update the latest status mutation journal
          updatedMutationJournal.status = "success";
          await updatedMutationJournal.save({ transaction: t });

          // create a new mutation journal at destination warehouse
          const newMutationForDestinationWarehouse = await Journal.create({
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
            description: `Warehouse Admin mutation, Get new stock from ${sourceWarehouseName.name}`,
          });

          await t.commit();
          return res.status(200).json({
            ok: true,
            message: "Success updating stock at destination warehouse",
            detail: updatedMutation,
            journal: newMutationForDestinationWarehouse,
          });
        }
      } else {
        mutation.status = "failed";
        mutation.description = `Not enough stock at ${sourceWarehouseName.name} or stock is already not equal to previous stock`;
        await mutation.save({ transaction: t });

        // update the latest mutation journal
        updatedMutationJournal.stock = mutation.stock;
        updatedMutationJournal.status = "failed";
        await updatedMutationJournal.save({ transaction: t });

        await t.commit();
        return res.status(400).json({
          ok: false,
          message: `Failed, not enough stock at ${sourceWarehouseName.name} or stock is already not equal to previous stock`,
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
