const { Op, literal } = require("sequelize");
const { Mutation, Product, Warehouse, Admin, ProductImage, Category, sequelize, Journal, OrderItem, Order, WarehouseAddress } = require("../models");

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
    const { page = 1, size = 5, sort = "id", order = "DESC", search, warehouseId = null, month = null, year = null } = req.query;
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

    if (month || year) {
      whereCondition.createdAt = {
        [Op.and]: [
          // Optional: Combine multiple conditions
          // Filter by the current month and year
          month && literal(`MONTH(createdAt) = ${parseInt(month)}`), // Optional: Filter by the current month
          year && literal(`YEAR(createdAt) = ${parseInt(year)}`), // Optional: Filter by the current year
        ].filter(Boolean), // Remove null and undefined values
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

exports.summaryTotalStock = async (req, res) => {
  try {
    const { warehouseId = null, month = null, year = null } = req.query;

    // Get the latest successful mutations for each product
    const summary = await Mutation.findAll({
      attributes: [
        "productId",
        "warehouseId",
        [literal(`SUM(CASE WHEN mutationType = 'add' AND status = 'success' THEN mutationQuantity ELSE 0 END)`), "totalAddition"],
        [literal(`SUM(CASE WHEN mutationType = 'subtract' AND status = 'success' THEN mutationQuantity ELSE 0 END)`), "totalSubtraction"],
        [
          literal(
            `(SELECT stock FROM Mutations AS sub WHERE sub.productId = Mutation.productId AND sub.warehouseId = Mutation.warehouseId AND sub.status = 'success' AND ${
              month ? "MONTH(sub.createdAt) = " + parseInt(month) : "MONTH(NOW())"
            } AND ${year ? "YEAR(sub.createdAt) = " + parseInt(year) : "YEAR(NOW())"} ORDER BY sub.createdAt DESC LIMIT 1)`
          ),
          "endingStock",
        ],
      ],
      where: {
        ...(warehouseId && {
          warehouseId,
        }),
        status: "success",
        ...(month && {
          createdAt: literal(`MONTH(createdAt) = ${parseInt(month)}`),
        }),
        ...(year && {
          createdAt: literal(`YEAR(createdAt) = ${parseInt(year)}`),
        }),
      },
      group: ["productId", "warehouseId"],
    });

    // Get the overall total for addition, subtraction, and stock
    const overallTotal = await sequelize.query(
      `SELECT
        SUM(totalAddition) AS overallTotalAddition,
        SUM(totalSubtraction) AS overallTotalSubtraction,
        SUM(endingStock) AS overallTotalStock
      FROM (
        -- Get the latest successful mutations for each product (subquery)
        SELECT
          m.productId,
          m.warehouseId,
          -- Calculate the total addition and subtraction
          SUM(CASE WHEN m.mutationType = 'add' AND m.status = 'success' THEN m.mutationQuantity ELSE 0 END) AS totalAddition,
          SUM(CASE WHEN m.mutationType = 'subtract' AND m.status = 'success' THEN m.mutationQuantity ELSE 0 END) AS totalSubtraction,
          -- Retrieve the latest stock for each product and warehouse
          COALESCE((SELECT stock FROM Mutations AS sub WHERE sub.productId = m.productId AND sub.warehouseId = m.warehouseId AND sub.status = 'success' AND ${
            month ? "MONTH(sub.createdAt) = " + parseInt(month) : "MONTH(NOW())"
          } AND ${year ? "YEAR(sub.createdAt) = " + parseInt(year) : "YEAR(NOW())"} ORDER BY sub.createdAt DESC LIMIT 1), 0) AS endingStock
        FROM Mutations AS m
        -- Filter by warehouseId or month if provided
        WHERE m.status = 'success' 
        AND ${month ? `MONTH(m.createdAt) = ${parseInt(month)}` : "MONTH(NOW())"} 
        AND ${year ? `YEAR(m.createdAt) = ${parseInt(year)}` : "YEAR(NOW())"}
        ${warehouseId ? `AND m.warehouseId = ${warehouseId}` : ""}
        GROUP BY m.productId, m.warehouseId
      ) AS subquery`,
      { type: sequelize.QueryTypes.SELECT }
    );

    res.status(200).json({
      ok: true,
      message: "Summary of total stock retrieved successfully",
      detail: {
        overallTotal: overallTotal[0],
        summary,
      },
    });
  } catch (error) {
    console.error("Error retrieving total stock:", error);
    res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

exports.getAllMutationsJournal = async (req, res) => {
  try {
    const { page = 1, size = 5, sort = "id", order = "DESC", search, warehouseId = null, destinationWarehouseId = null, month = null, year = null, status } = req.query;
    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    const whereCondition = {};
    // whereCondition.status = "pending";

    if (search) {
      whereCondition.productId = { [Op.like]: `%${search}%` };
    }

    if (warehouseId) {
      whereCondition[Op.or] = [{ warehouseId }, { destinationWarehouseId: warehouseId }];
    }

    if (destinationWarehouseId) {
      whereCondition.destinationWarehouseId = destinationWarehouseId;
    }

    if (month || year) {
      whereCondition.createdAt = {
        [Op.and]: [
          // Optional: Combine multiple conditions
          // Filter by the current month and year
          month && literal(`MONTH(createdAt) = ${parseInt(month)}`), // Optional: Filter by the current month
          year && literal(`YEAR(createdAt) = ${parseInt(year)}`), // Optional: Filter by the current year
        ].filter(Boolean), // Remove null and undefined values
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
      // Promise.all is used to wait for all promises to resolve
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
        status: "pending",
      },
      transaction: t,
    });

    if (isExistMutation) {
      await t.rollback();
      return res.status(400).json({
        ok: false,
        message: "Mutation with same product, and source warehouse already exists",
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
        description: `Manual request stock, ${sourceWarehouseName.name} -> ${destinationWarehouseName.name}`,
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
          const updatedMutation = await Mutation.create(
            {
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
              description: `Manual request stock, Get new stock from ${sourceWarehouseName.name}`,
            },
            { transaction: t }
          );

          // update the latest status in the mutation journal
          updatedMutationJournal.status = "success";
          updatedMutationJournal.stock = mutation.stock;
          await updatedMutationJournal.save({ transaction: t });

          // create a new mutation journal at destination warehouse
          const newMutationForDestinationWarehouse = await Journal.create(
            {
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
              description: `Manual request stock, Get new stock from ${sourceWarehouseName.name}`,
            },
            { transaction: t }
          );

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
            description: `Manual request stock, Get new stock from ${sourceWarehouseName.name}`,
          });

          // update the latest status mutation journal
          updatedMutationJournal.status = "success";
          updatedMutationJournal.stock = mutation.stock;
          await updatedMutationJournal.save({ transaction: t });

          // create a new mutation journal at destination warehouse
          const newMutationForDestinationWarehouse = await Journal.create({
            mutationId: updatedMutation.id,
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
            description: `Manual request stock, Get new stock from ${sourceWarehouseName.name}`,
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
