const { Order } = require("../models");

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

exports.getAllOrder = async (req, res) => {
  try {
    const order = await Order.findAll();

    if (!order) {
      return res.status(404).json({
        ok: false,
        meesage: "There is no order yet",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Get all order successfully",
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
