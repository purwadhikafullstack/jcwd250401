const { Sequelize, Op } = require("sequelize");
const axios = require("axios");
const fs = require("fs").promises;

const { isAfter, differenceInMinutes } = require("date-fns");
const { startOfMonth, endOfMonth, format, eachDayOfInterval, isValid, parseISO } = require("date-fns");

const { Address, Order, OrderItem, Product, ProductImage, Category, ProductCategory, Warehouse, Shipment, Cart, CartItem, User, Mutation, WarehouseAddress, Journal, sequelize } = require("../models");

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
  const t = await sequelize.transaction();

  try {
    const order = await Order.findOne({
      where: {
        id,
        userId,
      },
      transaction: t,
    });

    if (!order) {
      await t.rollback();
      return res.status(404).json({
        ok: false,
        message: "Order not found",
      });
    }

    if (req.file) {
      order.paymentProofImage = req.file.filename;
    } else {
      await t.rollback();
      return res.status(400).json({
        ok: false,
        message: "Payment proof image is required",
      });
    }

    order.status = "waiting-for-confirmation";
    await order.save({ transaction: t });
    await t.commit();

    return res.status(200).json({
      ok: true,
      message: "Payment proof uploaded successfully",
      detail: order,
    });
  } catch (error) {
    await t.rollback();
    console.error(error);

    if (req.file) {
      const filePath = `../public/${req.file.filename}`;
      await fs.unlink(filePath); // Delete file from public folder
    }
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      detail: String(error),
    });
  }
};

exports.rejectPayment = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findOne({
      where: {
        id,
      },
    });

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: "Order not found",
      });
    }

    order.status = "unpaid";

    await order.save();

    return res.status(200).json({
      ok: true,
      message: "Payment rejected successfully",
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

exports.confirmShip = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findOne({
      where: {
        id,
      },
    });

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: "Order not found",
      });
    }

    order.status = "on-delivery";

    await order.save();
    return res.status(200).json({
      ok: true,
      message: "Shipping confirmed successfully",
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

exports.confirmShipUser = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findOne({
      where: {
        id,
      },
    });

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: "Order not found",
      });
    }

    order.status = "delivered";

    await order.save();

    return res.status(200).json({
      ok: true,
      message: "Shipping confirmed successfully",
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

exports.automaticConfirmShipping = async (req, res) => {
  try {
    // Fetch orders with status 'on-delivery'
    const orders = await Order.findAll({
      where: {
        status: "on-delivery",
      },
    });

    // Check if there are no orders with status 'on-delivery'
    if (!orders.length) {
      return console.log("No orders with status 'on-delivery' found");
    }

    const now = Date.now();

    // Filter orders that need to be confirmed (updated more than 7 days ago)
    const ordersToConfirm = orders.filter((order) => {
      const orderUpdatedAt = new Date(order.updatedAt).getTime();
      const diffInMinutes = differenceInMinutes(now, orderUpdatedAt);

      return diffInMinutes >= 7 * 24 * 60; // 7 days in minutes
    });

    // Check if there are no orders to confirm
    if (ordersToConfirm.length === 0) {
      return console.log("No orders to confirm");
    }

    // Update the status of orders to 'shipped'
    await Promise.all(
      ordersToConfirm.map(async (order) => {
        // Ensure order is not undefined before updating

        if (order && order.update) {
          await order.update({ status: "delivered" });
        }
      })
    );
    return console.log("Orders confirmed successfully");
  } catch (error) {
    console.error(error);
  }
};

// Get all order lists from all users
exports.getAllOrderLists = async (req, res) => {
  try {
    const { status = "all", page = 1, size = 5, sort } = req.query;
    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    const orderFilter = {
      attributes: ["id", "status", "totalPrice", "paymentBy", "paymentProofImage", "userId", "shipmentId", "warehouseId", "createdAt", "updatedAt"],
      where: status !== "all" ? { status } : undefined,
      include: [
        {
          model: OrderItem,
          attributes: ["id", "quantity", "createdAt", "updatedAt"],
          include: [
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
        },
      ],
    };

    if (sort) {
      if (sort === "price-asc") {
        orderFilter.order = [["totalPrice", "ASC"]];
      } else if (sort === "price-desc") {
        orderFilter.order = [["totalPrice", "DESC"]];
      } else if (sort === "date-desc") {
        orderFilter.order = [["updatedAt", "DESC"]];
      } else if (sort === "date-asc") {
        orderFilter.order = [["updatedAt", "ASC"]];
      }
    }

    const orders = await Order.findAll({
      ...orderFilter, // Order by updatedAt in descending order
      limit,
      offset,
    });

    if (orders.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "No Data matches",
      });
    }

    // Use a Map for better grouping
    let groupedOrdersMap = new Map();

    const getShipmentDetails = async (shipmentId) => {
      const shipment = await Shipment.findByPk(shipmentId, {
        attributes: ["id", "addressId", "name", "cost"],
      });

      return shipment;
    };

    const getUserProfile = async (userId) => {
      const user = await User.findByPk(userId, {
        attributes: ["id", "username", "firstName", "lastName"],
      });

      return user;
    };

    const getAddressDetails = async (addressId) => {
      const address = await Address.findByPk(addressId);
      return address;
    };

    const getWarehouseDetails = async (warehouseId) => {
      const warehouse = await Warehouse.findByPk(warehouseId, {
        attributes: ["id", "name"],
      });
      return warehouse;
    };

    for (const order of orders) {
      const orderId = order.id;

      if (!groupedOrdersMap.has(orderId)) {
        groupedOrdersMap.set(orderId, {
          orderId,
          paymentBy: order.paymentBy,
          paymentProofImage: order.paymentProofImage,
          totalPrice: order.totalPrice,
          totalPriceBeforeCost: 0,
          status: order.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          totalQuantity: 0,
          Products: [],
          Shipment: await getShipmentDetails(order.shipmentId),
          User: await getUserProfile(order.userId),
          Address: await getAddressDetails((await getShipmentDetails(order.shipmentId)).addressId),
          Warehouse: await getWarehouseDetails(order.warehouseId),
        });
      }

      const existingOrder = groupedOrdersMap.get(orderId);

      order.OrderItems.forEach((orderItem) => {
        const product = orderItem.Product;
        const productImages = product.productImages.map((image) => ({
          id: image.id,
          imageUrl: image.imageUrl,
        }));

        const existingProduct = existingOrder.Products.find((p) => p.productId === product.id);

        if (!existingProduct) {
          const productPriceBeforeCost = orderItem.quantity * product.price; // Calculate totalPriceBeforeCost

          existingOrder.Products.push({
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

          existingOrder.totalPriceBeforeCost += productPriceBeforeCost; // Update totalPriceBeforeCost
          existingOrder.totalQuantity += orderItem.quantity;
        } else {
          existingProduct.quantity += orderItem.quantity;
          existingOrder.totalQuantity += orderItem.quantity;
        }
      });
    }

    // Convert the map values back to an array
    let groupedOrderListsWithImages = Array.from(groupedOrdersMap.values());

    const totalUniqueOrders = await Order.count({
      where: orderFilter.where,
    });

    const totalPages = Math.ceil(totalUniqueOrders / limit);

    const paginationInfo = {
      totalRecords: totalUniqueOrders,
      totalPages: totalPages,
      currentPage: parseInt(page),
    };

    return res.status(200).json({
      ok: true,
      message: "Get all order successfully",
      detail: Object.values(groupedOrderListsWithImages),
      pagination: paginationInfo,
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

const getProductStock = async (products) => {
  return await Promise.all(
    products.map(async (item) => {
      try {
        const product = await Product.findOne({
          where: { id: item.productId },
          attributes: ["id", "price"],
        });

        if (!product) {
          console.error(`Product not found for productId ${item.productId}`);
          throw new Error(`Product not found for productId ${item.productId}`);
        }

        const warehouses = await Warehouse.findAll();

        const mutations = await Promise.all(
          warehouses.map(async (warehouse) => {
            try {
              const latestMutation = await Mutation.findOne({
                attributes: ["stock"],
                where: {
                  productId: product.id,
                  warehouseId: warehouse.id,
                },
                order: [["createdAt", "DESC"]],
                limit: 1,
              });

              return {
                warehouseId: warehouse.id,
                warehouseName: warehouse.name,
                totalStock: latestMutation ? latestMutation.stock : 0,
              };
            } catch (mutationError) {
              console.error(`Error in getProductStock for productId ${product.id} and warehouseId ${warehouse.id}:`, mutationError);
              throw mutationError;
            }
          })
        );

        // Calculate the total stock from all warehouses
        const totalStockAllWarehouses = mutations.reduce((total, mutation) => total + mutation.totalStock, 0);

        return {
          ...product.toJSON(),
          Mutations: mutations || [],
          totalStockAllWarehouses: totalStockAllWarehouses || 0,
        };
      } catch (error) {
        console.error(`Error in getProductStock for productId ${item.productId}:`, error);
        throw error; // Rethrow the error to be caught by the caller
      }
    })
  );
};

exports.createOrder = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { addressId, warehouseId, productOnCart, shippingCost, paymentBy } = req.body;

    // Calculate product stock
    const productStock = await getProductStock(productOnCart);

    // Check if the quantity in the order is sufficient based on available stock
    const insufficientStockProducts = [];
    for (const item of productOnCart) {
      const product = productStock.find((p) => p.id === item.productId);
      const totalStockForProduct = product ? product.totalStockAllWarehouses : 0;

      if (item.quantity > totalStockForProduct) {
        insufficientStockProducts.push({
          productId: item.productId,
          productName: product.name,
          requestedQuantity: item.quantity,
          availableStock: totalStockForProduct,
        });

        // updating cartItem quantity

        const cartItem = await CartItem.findOne({
          where: { productId: item.productId, cartId: item.cartId },
        });

        await cartItem.update({ quantity: totalStockForProduct });
      }
    }

    if (insufficientStockProducts.length > 0) {
      return res.status(400).json({
        ok: false,
        message: "Insufficient stock for some products in the order, redirecting you to the cart page",
      });
    }

    // If there is sufficient stock, continue with order creation

    const order = await Order.create({
      userId,
      warehouseId,
      paymentBy,
      status: "unpaid",
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
      addressId,
    });

    // Update shipmentId in Order table
    await order.update({ shipmentId: shipment.id });

    // Delete cart
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
    const { status = "all", page = 1, size = 5, sort } = req.query;
    const limit = parseInt(size);
    const offset = (parseInt(page) - 1) * limit;

    const orderFilter = {
      attributes: ["id", "status", "totalPrice", "paymentBy", "userId", "shipmentId", "warehouseId", "createdAt", "updatedAt"],
      where: status !== "all" ? { status } : undefined,
      include: [
        {
          model: OrderItem,
          attributes: ["id", "quantity", "createdAt", "updatedAt"],
          include: [
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
        },
      ],
    };

    if (userId) {
      orderFilter.where = { ...orderFilter.where, userId };
    }

    if (sort) {
      if (sort === "price-asc") {
        orderFilter.order = [["totalPrice", "ASC"]];
      } else if (sort === "price-desc") {
        orderFilter.order = [["totalPrice", "DESC"]];
      } else if (sort === "date-desc") {
        orderFilter.order = [["updatedAt", "DESC"]];
      } else if (sort === "date-asc") {
        orderFilter.order = [["updatedAt", "ASC"]];
      }
    }

    const orders = await Order.findAll({
      ...orderFilter, // Order by updatedAt in descending order
      limit,
      offset,
    });

    if (orders.length === 0) {
      return res.status(404).json({
        ok: false,
        message: "No Data matches",
      });
    }

    // Use a Map for better grouping
    let groupedOrdersMap = new Map();

    const getShipmentDetails = async (shipmentId) => {
      const shipment = await Shipment.findByPk(shipmentId, {
        attributes: ["id", "addressId", "name", "cost"],
      });

      return shipment;
    };

    const getAddressDetails = async (addressId) => {
      const address = await Address.findByPk(addressId);
      return address;
    };

    const getWarehouseDetails = async (warehouseId) => {
      const warehouse = await Warehouse.findByPk(warehouseId, {
        attributes: ["id", "name"],
      });
      return warehouse;
    };

    for (const order of orders) {
      const orderId = order.id;

      if (!groupedOrdersMap.has(orderId)) {
        groupedOrdersMap.set(orderId, {
          orderId,
          paymentBy: order.paymentBy,
          totalPrice: order.totalPrice,
          totalPriceBeforeCost: 0,
          status: order.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          totalQuantity: 0,
          Products: [],
          Shipment: await getShipmentDetails(order.shipmentId),
          Address: await getAddressDetails((await getShipmentDetails(order.shipmentId)).addressId),
          Warehouse: await getWarehouseDetails(order.warehouseId),
        });
      }

      const existingOrder = groupedOrdersMap.get(orderId);

      order.OrderItems.forEach((orderItem) => {
        const product = orderItem.Product;
        const productImages = product.productImages.map((image) => ({
          id: image.id,
          imageUrl: image.imageUrl,
        }));

        const existingProduct = existingOrder.Products.find((p) => p.productId === product.id);

        if (!existingProduct) {
          const productPriceBeforeCost = orderItem.quantity * product.price; // Calculate totalPriceBeforeCost

          existingOrder.Products.push({
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

          existingOrder.totalPriceBeforeCost += productPriceBeforeCost; // Update totalPriceBeforeCost
          existingOrder.totalQuantity += orderItem.quantity;
        } else {
          existingProduct.quantity += orderItem.quantity;
          existingOrder.totalQuantity += orderItem.quantity;
        }
      });
    }

    // Convert the map values back to an array
    let groupedOrderListsWithImages = Array.from(groupedOrdersMap.values());

    const totalUniqueOrders = await Order.count({
      where: orderFilter.where,
    });

    const totalPages = Math.ceil(totalUniqueOrders / limit);

    const paginationInfo = {
      totalRecords: totalUniqueOrders,
      totalPages: totalPages,
      currentPage: parseInt(page),
    };

    return res.status(200).json({
      ok: true,
      message: "Get all order successfully",
      detail: Object.values(groupedOrderListsWithImages),
      pagination: paginationInfo,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      detail: String(error),
    });
  }
};

exports.automaticCancelUnpaidOrder = async (req, res) => {
  try {
    // Fetch unpaid orders
    const orders = await Order.findAll({
      where: {
        status: "unpaid",
      },
    });

    // Check if there are no unpaid orders
    if (!orders.length) {
      return console.log("No unpaid orders found");
    }

    const now = Date.now();

    // Filter orders that need to be canceled (created more than 24 hours ago)
    const ordersToCancel = orders.filter((order) => {
      const orderCreatedAt = new Date(order.createdAt).getTime();
      const diffInMinutes = differenceInMinutes(now, orderCreatedAt);

      return diffInMinutes >= 24 * 60; // 24 hours in minutes
    });

    // Check if there are no orders to cancel
    if (ordersToCancel.length === 0) {
      return console.log("No expire orders to cancel");
    }

    // Update the status of orders to 'cancelled'
    await Promise.all(
      ordersToCancel.map(async (order) => {
        // Ensure order is not undefined before updating
        if (order && order.update) {
          await order.update({ status: "cancelled" });
        }
      })
    );
    return console.log("Unpaid expired orders cancelled successfully");
  } catch (error) {
    console.error(error);
  }
};

// Function to find the nearest warehouse using Haversine formula
function findNearestWarehouse(sourceLatitude, sourceLongitude, warehouses, requiredStock) {
  const earthRadius = 6371; // Radius of the earth in km

  // Helper function to convert degrees to radians
  function toRad(degrees) {
    return (degrees * Math.PI) / 180;
  }

  let nearestWarehouse = null;
  let minDistance = Infinity;
  for (const warehouse of warehouses) {
    const { latitude, longitude } = warehouse.WarehouseAddress;
    const { stock } = warehouse.Mutations[0] || { stock: 0 };

    // Haversine formula (menentukan jarak antara dua titik pada permukaan bola)
    const dLat = toRad(latitude - sourceLatitude); // Calculate the difference in latitude in radians
    const dLon = toRad(longitude - sourceLongitude); // Calculate the difference in longitude in radians

    // Variable to calculate the distance
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) + // kuadrat setengah jarak lingkaran besar sepanjang garis lintang
      Math.cos(toRad(sourceLatitude)) * Math.cos(toRad(latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2); // kuadrat setengah jarak lingkaran sepanjang garis bujur

    const centralAngle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Menghitung sudut sentral antara dua titik pada lingkaran besar
    const distance = earthRadius * centralAngle; // Menghitung jarak antara dua titik pada permukaan bola

    if (stock >= requiredStock && distance < minDistance) {
      // check if the stock is greater than or equal to the required stock
      minDistance = distance;
      nearestWarehouse = warehouse;
    }
  }

  return nearestWarehouse;
}

// Function to update the source warehouse stock
async function updateSourceWarehouseStock(productId, warehouseId, destinationWarehouseId, quantity, sourceWarehouseAdminId) {
  const t = await sequelize.transaction();
  try {
    // get the latest mutation from the source warehouse in order to get the stock
    const findLatestMutationSourceWarehouse = await Mutation.findOne({
      where: {
        productId,
        warehouseId,
        status: "success",
      },
      order: [["createdAt", "DESC"]],
      limit: 1,
      transaction: t,
    });

    const destinationWarehouseData = await Warehouse.findOne({
      where: {
        id: destinationWarehouseId,
      },
      attributes: ["name"],
      transaction: t,
    });

    let sourceWarehouseStock = findLatestMutationSourceWarehouse.stock || 0;
    let newStock = sourceWarehouseStock + quantity;

    // update the source warehouse stock by creating a new mutation
    const mutation = await Mutation.create(
      {
        productId,
        warehouseId,
        destinationWarehouseId,
        previousStock: sourceWarehouseStock,
        mutationQuantity: quantity,
        mutationType: "add",
        adminId: sourceWarehouseAdminId,
        stock: newStock,
        status: "success",
        isManual: false,
        description: `Auto request, get new stock automatically from ${destinationWarehouseData.name}.`,
      },
      {
        transaction: t,
      }
    );

    await Journal.create(
      {
        mutationId: mutation.id,
        productId,
        warehouseId,
        destinationWarehouseId,
        previousStock: sourceWarehouseStock,
        mutationQuantity: quantity,
        mutationType: "add",
        adminId: sourceWarehouseAdminId,
        stock: newStock,
        status: "success",
        isManual: false,
        description: `Auto request, get new stock automatically from ${destinationWarehouseData.name}.`,
      },
      {
        transaction: t,
      }
    );

    await t.commit();
    return mutation;
  } catch (error) {
    await t.rollback();
    throw error;
  }
}

exports.confirmPaymentProofUser = async (req, res) => {
  const t = await sequelize.transaction();
  const { orderId, productId } = req.body;

  try {
    const orderItem = await OrderItem.findAll({
      where: {
        orderId,
      },
      include: [
        {
          model: Order,
          where: {
            status: "waiting-for-confirmation",
          },
          include: [
            {
              model: Warehouse,
              include: [
                {
                  model: Mutation,
                  where: {
                    status: "success",
                    productId,
                  },
                  order: [["createdAt", "DESC"]],
                  limit: 1,
                },
                {
                  model: WarehouseAddress,
                  attributes: ["latitude", "longitude"],
                },
              ],
            },
          ],
        },
      ],
      transaction: t,
    });

    if (!orderItem) {
      await t.rollback();
      return res.status(404).json({
        ok: false,
        message: "Order not found",
        detail: "Order with status waiting-for-confirmation not found",
      });
    }

    orderItem.Order.status = "ready-to-ship";
    await orderItem.Order.save({ transaction: t });

    const stockProductAtCurrentWarehouse = orderItem.Order.Warehouse.Mutations[0].stock;
    const warehouselatitude = orderItem.Order.Warehouse.WarehouseAddress.latitude;
    const warehouseLongitude = orderItem.Order.Warehouse.WarehouseAddress.longitude;
    const orderQuantity = orderItem.quantity;
    const requiredStock = orderQuantity - stockProductAtCurrentWarehouse;
    const sourceWarehouseName = orderItem.Order.Warehouse.name;
    const sourceWarehouseId = orderItem.Order.Warehouse.id;
    const sourceWarehouseAdminId = orderItem.Order.Warehouse.adminId;

    const allWarehouses = await Warehouse.findAll({
      attributes: ["id", "name", "warehouseAddressId"],
      include: [
        {
          model: WarehouseAddress,
          attributes: ["street", "city", "province", "latitude", "longitude"],
        },
        {
          model: Mutation,
          attributes: ["id", "stock"],
          where: {
            status: "success",
            productId,
          },
          order: [["createdAt", "DESC"]],
          limit: 1,
        },
      ],
      transaction: t,
    });

    if (orderItem.Order.status === "ready-to-ship") {
      if (orderQuantity > stockProductAtCurrentWarehouse) {
        // insufficient stock
        const nearestWarehouse = findNearestWarehouse(warehouselatitude, warehouseLongitude, allWarehouses, orderQuantity);

        if (!nearestWarehouse) {
          await t.rollback();
          return res.status(404).json({
            ok: false,
            message: "Nearest warehouse with sufficient stock not found",
          });
        }

        // Create mutation for update stock at source warehouse
        const newMutationForSourceWarehouse = await updateSourceWarehouseStock(productId, sourceWarehouseId, nearestWarehouse.id, requiredStock, sourceWarehouseAdminId);

        // Create mutation for update stock at destination warehouse
        let currentDestinationWarehouseStock = nearestWarehouse.Mutations[0].stock;

        const newMutationForDestinationWarehouse = await Mutation.create(
          {
            productId,
            warehouseId: nearestWarehouse.id,
            destinationWarehouseId: nearestWarehouse.id,
            mutationQuantity: requiredStock,
            previousStock: currentDestinationWarehouseStock,
            mutationType: "subtract",
            adminId: sourceWarehouseAdminId,
            stock: (currentDestinationWarehouseStock -= requiredStock),
            status: "success",
            isManual: false,
            description: `Auto request, stock subtracted automatically to ${sourceWarehouseName} for user order.`,
          },
          { transaction: t }
        );

        await Journal.create(
          {
            productId,
            warehouseId: nearestWarehouse.id,
            destinationWarehouseId: nearestWarehouse.id,
            mutationId: newMutationForDestinationWarehouse.id,
            mutationQuantity: requiredStock,
            previousStock: newMutationForDestinationWarehouse.previousStock,
            mutationType: "subtract",
            adminId: sourceWarehouseAdminId,
            stock: newMutationForDestinationWarehouse.stock,
            status: "success",
            isManual: false,
            description: `Auto request, stock subtracted automatically to ${sourceWarehouseName} for user order.`,
          },
          { transaction: t }
        );

        await t.commit();
        return res.status(200).json({
          ok: true,
          message: "Payment proof confirmed successfully",
          detail: {
            orderItem,
            newMutationForSourceWarehouse,
          },
        });
      }
      // sufficient stock
      // Create mutation for update stock at source warehouse
      const newMutationForSourceWarehouse = await Mutation.create(
        {
          productId,
          warehouseId: sourceWarehouseId,
          destinationWarehouseId: sourceWarehouseId,
          mutationQuantity: orderQuantity,
          previousStock: stockProductAtCurrentWarehouse,
          mutationType: "subtract",
          adminId: sourceWarehouseAdminId,
          stock: stockProductAtCurrentWarehouse - orderQuantity,
          status: "success",
          isManual: false,
          description: "Auto request, stock subtracted automatically for user order.",
        },
        { transaction: t }
      );

      await Journal.create(
        {
          mutationId: newMutationForSourceWarehouse.id,
          productId,
          warehouseId: sourceWarehouseId,
          destinationWarehouseId: sourceWarehouseId,
          mutationId: newMutationForSourceWarehouse.id,
          mutationQuantity: orderQuantity,
          previousStock: stockProductAtCurrentWarehouse,
          mutationType: "subtract",
          adminId: sourceWarehouseAdminId,
          stock: stockProductAtCurrentWarehouse - orderQuantity,
          status: "success",
          isManual: false,
          description: "Auto request, stock subtracted automatically for user order.",
        },
        { transaction: t }
      );

      await t.commit();
      return res.status(200).json({
        ok: true,
        message: "Payment proof confirmed successfully",
        detail: {
          orderItem,
          newMutationForSourceWarehouse,
        },
      });
    }
  } catch (error) {
    console.error(error);
    await t.rollback();
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

const convertWarehouseName = (name) => {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

exports.getSalesReport = async (req, res) => {
  try {
    const { month, year, warehouse } = req.query;

    // Validate month and year parameters
    if (!month || !year) {
      return res.status(400).json({
        ok: false,
        message: "Month and year are required parameters.",
      });
    }

    // Convert warehouse to match the format in the database
    const formattedWarehouseName = warehouse ? convertWarehouseName(warehouse) : null;

    // Define start and end dates for the given month and year using date-fns
    const startDate = startOfMonth(new Date(year, month - 1));
    const endDate = endOfMonth(new Date(year, month - 1));

    // Define additional conditions for warehouse filtering
    const warehouseCondition = formattedWarehouseName ? { name: formattedWarehouseName } : {};

    // Fetch warehouse details based on the name
    const warehouseDetails = formattedWarehouseName ? await Warehouse.findOne({ where: warehouseCondition }) : null;

    // Define conditions for date range filtering
    const dateRangeCondition = {
      createdAt: { [Op.between]: [startDate, endDate] },
    };

    // Add warehouse condition if a specific warehouse is provided
    if (warehouseDetails) {
      dateRangeCondition.warehouseId = warehouseDetails.id;
    }

    // Find all delivered orders within the specified date range and optional warehouse filter
    const deliveredOrders = await Order.findAll({
      attributes: ["id", "userId", "createdAt"], // Include necessary attributes
      include: [
        {
          model: OrderItem, // Include the associated OrderItem model
          attributes: ["productId", "quantity"], // Include the necessary attributes from OrderItem
        },
      ],
      where: {
        status: "delivered",
        ...dateRangeCondition,
      },
      raw: true,
    });

    // Calculate total transaction count and total number of unique customers
    const uniqueOrders = new Set(deliveredOrders.map((order) => order.id));
    const totalTransactions = uniqueOrders.size;
    const uniqueCustomers = new Set(deliveredOrders.map((order) => order.userId)).size;

    const uniqueOrderIds = new Set();

    // Fetch order items for each delivered order
    const orderItems = await Promise.all(
      deliveredOrders.map(async (order) => {
        // Add the order ID to the set if it hasn't been added before
        if (!uniqueOrderIds.has(order.id)) {
          uniqueOrderIds.add(order.id);

          const items = await OrderItem.findAll({
            attributes: ["productId", "quantity", "createdAt"],
            where: {
              orderId: order.id,
            },
            raw: true,
          });
          return items;
        }

        return []; // Return an empty array for orders that have already been counted
      })
    );

    // Filter out empty arrays from orderItems
    const flattenedOrderItems = orderItems.flat();

    // Aggregate sales data based on productId and orderDate
    const salesReportMap = new Map();

    for (const orderItem of flattenedOrderItems) {
      const product = await Product.findByPk(orderItem.productId);
      const productPrice = product ? product.price : 0;

      // Ensure that orderItem.createdAt is a valid Date object
      const orderDate = orderItem.createdAt;

      const salesKey = `${orderItem.productId}_${format(orderDate, "yyyy-MM-dd")}`;

      if (salesReportMap.has(salesKey)) {
        // Update existing entry
        salesReportMap.set(salesKey, {
          ...salesReportMap.get(salesKey),
          totalSales: salesReportMap.get(salesKey).totalSales + orderItem.quantity * productPrice,
          totalQuantity: salesReportMap.get(salesKey).totalQuantity + orderItem.quantity,
        });
      } else {
        // Create a new entry
        salesReportMap.set(salesKey, {
          productId: orderItem.productId,
          productName: product ? product.name : "Unknown Product",
          totalSales: orderItem.quantity * productPrice,
          totalQuantity: orderItem.quantity,
          orderDate,
        });
      }
    }
    // Convert the map values to an array
    const salesReport = Array.from(salesReportMap.values());

    // Daily Sales Calculation
    const intervalDates = eachDayOfInterval({ start: startDate, end: endDate });

    const dailySales = intervalDates.map((date) => {
      const formattedDate = format(date, "yyyy-MM-dd");
      const totalSalesForDate = salesReport.reduce((total, item) => {
        if (format(item.orderDate, "yyyy-MM-dd") === formattedDate) {
          return total + item.totalSales;
        }
        return total;
      }, 0);

      return { date: formattedDate, totalSales: totalSalesForDate };
    });

    // Summing up total sales and total quantity sold for all products
    const aggregatedSalesReport = salesReport.reduce(
      (result, item) => {
        result.totalSales += item.totalSales;
        result.totalQuantity += item.totalQuantity;
        return result;
      },
      { totalSales: 0, totalQuantity: 0 }
    );

    const categoryCounts = {};

    // Iterate over each order item
    for (const orderItem of flattenedOrderItems) {
      const productId = orderItem.productId;
      const quantity = orderItem.quantity;

      // Find ProductCategories for the productId
      const productCategories = await ProductCategory.findAll({
        attributes: ["categoryId"],
        where: {
          productId: productId,
        },
        raw: true,
      });

      // Fetch category names based on categoryId and count them
      for (const productCategory of productCategories) {
        const categoryId = productCategory.categoryId;

        // Find Category for the categoryId
        const category = await Category.findByPk(categoryId);

        if (category) {
          const categoryName = category.name;

          // Exclude specific categories from counting
          const excludedCategories = ["Jackets", "Tops", "Bottom", "Accessories", "Bags"];
          if (!excludedCategories.includes(categoryName)) {
            // Count category names, considering the quantity
            categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + quantity;
          }
        }
      }
    }

    // Convert the category counts to an array
    const categoryData = Object.entries(categoryCounts).map(([categoryName, count]) => ({
      categoryName,
      count,
    }));

    // Initialize a map to store product counts by name and gender
    const productCountsByNameAndGender = new Map();

    // Iterate over each order item
    for (const orderItem of flattenedOrderItems) {
      const productId = orderItem.productId;
      const quantity = orderItem.quantity;

      const product = await Product.findByPk(productId);

      if (product) {
        const productNameWithGender = `${product.name} (${product.gender})`;

        // Exclude specific products from counting
        const excludedProducts = ["Unknown Product"];
        if (!excludedProducts.includes(productNameWithGender)) {
          // Count product names and gender, considering the quantity
          if (productCountsByNameAndGender.has(productNameWithGender)) {
            // Update existing entry
            productCountsByNameAndGender.set(productNameWithGender, productCountsByNameAndGender.get(productNameWithGender) + quantity);
          } else {
            // Create a new entry
            productCountsByNameAndGender.set(productNameWithGender, quantity);
          }
        }
      }
    }

    // Convert the product counts to an array
    const productData = Array.from(productCountsByNameAndGender.entries()).map(([productName, count]) => ({
      productName,
      count,
    }));

    return res.status(200).json({
      ok: true,
      message: "Sales report generated successfully",
      detail: [
        {
          warehouse: warehouseDetails ? warehouseDetails.name : "All Warehouses",
          month,
          year,
          totalTransactions,
          totalCustomers: uniqueCustomers,
          totalSales: aggregatedSalesReport.totalSales,
          itemSold: aggregatedSalesReport.totalQuantity,
          salesReport: salesReport,
          dailySales: dailySales,
          productCategoryData: categoryData,
          productData: productData,
        },
      ],
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

exports.cancelUnpaidOrder = async (req, res) => {
  const { orderId } = req.body;
  const { id: userId } = req.user;

  try {
    const order = await Order.findByPk(orderId, {
      where: {
        status: "unpaid",
        userId,
      },
    });

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: "Order not found",
      });
    }

    order.status = "cancelled";
    await order.save();

    return res.status(200).json({
      ok: true,
      message: "Order cancelled successfully",
      detail: order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};

exports.cancelOrderUser = async (req, res) => {
  const t = await sequelize.transaction();
  const { orderId, productId } = req.body;

  try {
    const orderItem = await OrderItem.findAll({
      where: { orderId, productId },
      include: [
        {
          model: Order,
          include: [
            {
              model: Warehouse,
              include: [
                {
                  model: Mutation,
                  where: { productId, status: "success" },
                  order: [["createdAt", "DESC"]],
                  limit: 1,
                },
                {
                  model: WarehouseAddress,
                  attributes: ["latitude", "longitude"],
                },
              ],
            },
          ],
        },
      ],
      transaction: t,
    });

    if (!orderItem) {
      await t.rollback();
      return res.status(404).json({
        ok: false,
        message: "Order not found",
        detail: "Order not found with the given ID",
      });
    }

    for (const item of orderItem) {
    if (item.Order.status === "waiting-for-confirmation") {
      // Update status to 'cancelled' for orders that are not yet processed
      item.Order.status = "cancelled";
      await item.Order.save({ transaction: t });
    } else if (item.Order.status === "ready-to-ship") {
      // Handle stock adjustment for orders that have been processed
      const stockProductAtCurrentWarehouse = item.Order.Warehouse.Mutations[0].stock;
      const orderQuantity = item.quantity;

      // Create mutation for reverting stock at source warehouse
      const newMutationForSourceWarehouse = await Mutation.create(
        {
          productId,
          warehouseId: item.Order.Warehouse.id,
          mutationQuantity: orderQuantity,
          previousStock: stockProductAtCurrentWarehouse,
          mutationType: "add", // Revert the stock subtraction
          adminId: orderItem.Order.Warehouse.adminId,
          stock: stockProductAtCurrentWarehouse + orderQuantity,
          status: "success",
          isManual: false,
          description: "Order cancellation, stock added back due to order cancellation.",
        },
        { transaction: t }
      );

      // Create a corresponding journal entry
      await Journal.create(
        {
          mutationId: newMutationForSourceWarehouse.id,
          productId,
          warehouseId: item.Order.Warehouse.id,
          mutationQuantity: orderQuantity,
          previousStock: stockProductAtCurrentWarehouse,
          mutationType: "add",
          adminId: item.Order.Warehouse.adminId,
          stock: stockProductAtCurrentWarehouse + orderQuantity,
          status: "success",
          isManual: false,
          description: "Order cancellation, stock added back due to order cancellation.",
        },
        { transaction: t }
      );

      orderItem.Order.status = "cancelled";
      await orderItem.Order.save({ transaction: t });
    }
    }

    await t.commit();
    return res.status(200).json({
      ok: true,
      message: "Order cancelled successfully",
      detail: {
        orderItem,
        statusUpdated: orderItem.Order.status,
      },
    });
  } catch (error) {
    console.error(error);
    await t.rollback();
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
    });
  }
};