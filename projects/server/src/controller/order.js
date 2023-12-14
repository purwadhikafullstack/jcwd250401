const { Op } = require("sequelize");
const axios = require("axios");
const { Order, OrderItem, Product, ProductImage, Warehouse, Shipment, Cart, CartItem } = require("../models");

// Config default axios with rajaongkir
axios.defaults.baseURL = "https://api.rajaongkir.com/starter";
axios.defaults.headers.common["key"] = process.env.RAJAONGKIR_APIKEY;
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

exports.getOrderCost = async (req, res) => {
  try {
    // Get data from request query params
    const { origin, destination, weight, courier } = req.query;

    const response = await axios.post("/cost", {
      origin,
      destination,
      weight,
      courier,
    });

    return res.status(200).json({
      ok: true,
      message: "Get cost successfully",
      detail: response.data.rajaongkir.results,
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
    } else {
      return res.status(400).json({
        ok: false,
        message: "Payment proof image is required",
      });
    }

    order.status = "waiting-for-payment-confirmation";

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

// Get all order lists from all users

exports.getAllOrderLists = async (req, res) => {
  try {
    const { status = "all", page = 1, size = 10, sort = "createdAt", order = "DESC", warehouseId, month } = req.query;
    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    const filter = {
      include: [
        {
          model: Order,
          attributes: ["id", "status", "totalPrice", "userId", "warehouseId"],
          where: status !== "all" ? { status } : undefined,
        },
        {
          model: Product,
          attributes: ["id", "name", "description", "price", "gender", "weight"],
        },
      ],
      where: {
        "$Order.status$": status !== "all" ? status : { [Op.ne]: null },
      },
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

    if (warehouseId) {
      filter.include[0].where = { warehouseId };
    }

    if (month) {
      const monthInt = parseInt(month);

      filter.where = {
        ...filter.where,
        createdAt: {
          [Op.and]: [{ [Op.gte]: new Date(new Date().getFullYear(), monthInt - 1, 1) }, { [Op.lte]: new Date(new Date().getFullYear(), monthInt, 0) }],
        },
      };
    }

    const orderLists = await OrderItem.findAll(filter);

    if (orderLists.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "No Data matches",
      });
    }

    const orderListsWithImages = await Promise.all(
      orderLists.map(async (orderItem) => {
        const product = orderItem.Product;

        const warehouse = await Warehouse.findOne({
          where: { id: orderItem.Order.warehouseId },
          attributes: ["id", "name"],
        });

        const productImages = await ProductImage.findAll({
          where: { productId: product.id },
          attributes: ["id", "imageUrl"],
        });

        return {
          id: orderItem.id,
          productId: product.id,
          orderId: orderItem.Order.id,
          quantity: orderItem.quantity,
          createdAt: orderItem.createdAt,
          updatedAt: orderItem.updatedAt,
          Order: {
            id: orderItem.Order.id,
            status: orderItem.Order.status,
            totalPrice: orderItem.Order.totalPrice,
            userId: orderItem.Order.userId,
            warehouse: {
              id: warehouse.id,
              warehouseName: warehouse.name,
            },
          },
          Product: {
            id: product.id,
            productName: product.name,
            productDescription: product.description,
            productPrice: product.price,
            productGender: product.gender,
            productWeight: product.weight,
            productImages: productImages,
          },
        };
      })
    );

    return res.status(200).json({
      ok: true,
      message: "Get all order successfully",
      detail: orderListsWithImages,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      detail: String(error),
    });
  }
};

// create order

exports.createOrder = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { addressId, warehouseId, productOnCart, shippingCost, paymentBy } = req.body;

    const order = await Order.create({
      userId,
      warehouseId,
      paymentBy,
      status: "waiting-for-payment",
    });

    const orderItems = await Promise.all(
      productOnCart.map(async (item) => {
        const product = await Product.findOne({
          where: { id: item.productId },
          attributes: ["id", "price"],
        });

        return {
          orderId: order.id,
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        };
      })
    );

    await OrderItem.bulkCreate(orderItems);

    // Calculate the total price of all products
    const totalProductPrice = orderItems.reduce((acc, item) => acc + item.quantity * item.price, 0);

    // Access the shipping cost directly from the array
    const shippingCostValue = shippingCost[1];

    // Calculate the total order price by adding the total product price and the shipping cost
    const totalOrderPrice = totalProductPrice + shippingCostValue;

    // Update the totalPrice column in the Order table
    await order.update({ totalPrice: totalOrderPrice });

    // Create shipment

    const shipment = await Shipment.create({
      name: shippingCost[0], // Accessing the shipping method directly
      cost: shippingCost[1], // Accessing the cost directly
      addressId: addressId,
    });

    // Update shipmentId in Order table
    await order.update({ shipmentId: shipment.id });

    // delete cart
    const cartIdsToDelete = productOnCart.map((item) => item.cartId);

    await CartItem.destroy({
      where: { cartId: cartIdsToDelete },
    });

    await Cart.destroy({
      where: { userId },
    });

    return res.status(201).json({
      ok: true,
      message: "Order created successfully",
      detail: { order, orderItems, shipment },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      detail: String(error),
    });
  }
};

exports.getOrderLists = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { status = "all", page = 1, size = 10, sort = "createdAt", order = "DESC" } = req.query;
    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    const filter = {
      include: [
        {
          model: Order,
          attributes: ["id", "status", "totalPrice", "userId", "createdAt", "updatedAt"],
          where: status !== "all" ? { status } : undefined,
        },
        {
          model: Product,
          attributes: ["id", "name", "description", "price", "gender", "weight"],
          include: [
            {
              model: ProductImage,
              as: "productImages",
              attributes: ["id", "imageUrl"],
            },
          ],
        },
      ],
      where: {
        "$Order.status$": status !== "all" ? status : { [Op.ne]: null },
      },
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

    if (userId) {
      filter.include[0].where = { userId };
    }

    const orderLists = await OrderItem.findAll(filter);

    if (orderLists.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "No Data matches",
      });
    }

    const groupedOrderListsWithImages = orderLists.reduce((acc, orderItem) => {
      const orderId = orderItem.Order.id;
      if (!acc[orderId]) {
        acc[orderId] = {
          orderId: orderItem.Order.id,
          totalPrice: orderItem.Order.totalPrice,
          status: orderItem.Order.status,
          createdAt: orderItem.Order.createdAt,
          updatedAt: orderItem.Order.updatedAt,
          totalQuantity: 0,
          Products: [],
        };
      }

      const product = orderItem.Product;

      const productImages = product.productImages.map((image) => ({
        id: image.id,
        imageUrl: image.imageUrl,
      }));

      acc[orderId].Products.push({
        orderItemId: orderItem.id,
        productId: product.id,
        quantity: orderItem.quantity,
        createdAt: orderItem.createdAt,
        updatedAt: orderItem.updatedAt,
        Product: {
          id: product.id,
          productName: product.name,
          productPrice: product.price,
          productGender: product.gender,
          productImages: productImages,
        },
      });

      acc[orderId].totalQuantity += orderItem.quantity;

      return acc;
    }, {});

    return res.status(200).json({
      ok: true,
      message: "Get all order successfully",
      detail: Object.values(groupedOrderListsWithImages),
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      detail: String(error),
    });
  }
};
