const { Order, OrderItem, Product } = require("../models");

exports.paymentProof = async (req, res) => {
  const { id, userId } = req.params;

  try {
    const order = await Order.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: "Order not found",
      });
    }

    if (req.file) {
      order.paymentProofImage = req.file.filename;
    }

    await order.save();
    return res.status(200).json({
      ok: true,
      message: "Payment proof uploaded successfully",
      detail: order,
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

exports.getOrderLists = async (req, res) => {
  try {
    const { status, page = 1, size = 10, sort = "createdAt", order = "DESC" } = req.query;
    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    const filter = {
      include: [
        {
          model: Order,
          attributes: ["id", "status", "totalPrice"],
          where: status !== "all" ? { status } : undefined,
        },
        {
          model: Product,
          attributes: ["id", "name", "image"],
        },
      ],
      where: {},
      limit: limit,
      offset: offset,
    };

    if (sort) {
      if (sort === "totalPrice") {
        filter.order = [[{ model: Order, as: "Order" }, sort, order]];
      } else {
        filter.order = [[sort, order]];
      }
    }

    const orderLists = await OrderItem.findAll(filter);

    if (orderLists.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "There is no order yet",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Get all order successfully",
      detail: orderLists,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      detail: String(error),
    });
  }
};
