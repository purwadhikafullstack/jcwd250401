const axios = require("axios");
const { Warehouse, WarehouseAddress, Admin, User, Address } = require("../models"); // Adjust the path as necessary4
const { Op, Sequelize } = require("sequelize");


exports.getAllWarehouses = async (req, res) => {
  try {
    const { adminId } = req.query;

    let whereClause = {};

    if (adminId) {
      whereClause = { adminId };
    }
    const warehouses = await Warehouse.findAll({
      where: whereClause,
      attributes: ["id", "name", "owner", "location", "warehouseImage", "phoneNumber", "OpenHour", "CloseHour"],
      include: [
        {
          model: WarehouseAddress,
          attributes: ["street", "city", "cityId", "province", "provinceId", "longitude", "latitude"],
        },
      ],
    });

    if (warehouses.length === 0) {
      return res.status(404).send({
        message: "Warehouses not found",
      });
    }

    res.json({
      ok: true,
      data: warehouses,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving warehouses: " + error.message,
    });
  }
};

exports.addWarehouse = async (req, res) => {
  const { name, street, city, cityId, province, provinceId, phoneNumber, OpenHour, CloseHour, owner } = req.body;
  const address = `${street}, ${city}, ${province}`;

  try {
    // Convert address to coordinates
    console.log("Converting address to coordinates:", address);
    const apiKey = process.env.OPENCAGE_APIKEY;

    const openCageResponse = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`);
    const { results } = openCageResponse.data;

    const longitude = results[0].geometry.lng;
    const latitude = results[0].geometry.lat;

    // Retrieve the uploaded image file, if available
    let warehouseImage;
    if (req.file) {
      warehouseImage = req.file.filename; // The filename where the image is stored
    } else {
      // Handle the case where no image is uploaded (optional)
      warehouseImage = "default-image-path"; // Or leave it undefined, based on your application logic
    }

    // Create Warehouse with location and coordinates
    const warehouse = await Warehouse.create({
      name,
      location: address,
      warehouseImage,
      phoneNumber,
      OpenHour,
      CloseHour,
      owner,
    });

    // Create WarehouseAddress
    const warehouseAddress = await WarehouseAddress.create({
      warehouseId: warehouse.id,
      street,
      city,
      cityId,
      province,
      provinceId,
      longitude,
      latitude,
    });

    // Update Warehouse with warehouseAddressId
    await Warehouse.update(
      {
        warehouseAddressId: warehouseAddress.id,
      },
      {
        where: {
          id: warehouse.id,
        },
      }
    );

    // If cityId or provinceId not found, return error
    if (warehouseAddress.cityId === null || warehouseAddress.provinceId === null) {
      return res.status(400).send("Invalid city or province.");
    }

    // If coordinates not found, return error
    if (warehouseAddress.latitude === null || warehouseAddress.longitude === null) {
      return res.status(400).send("Invalid address or unable to find coordinates.");
    }

    res.json({
      ok: true,
      data: {
        name: warehouse.name,
        location: warehouse.location,
        phoneNumber: warehouse.phoneNumber,
        OpenHour: warehouse.OpenHour,
        CloseHour: warehouse.CloseHour,
        city_id: warehouseAddress.cityId,
        province_id: warehouseAddress.provinceId,
        coordinates: {
          latitude: warehouseAddress.latitude,
          longitude: warehouseAddress.longitude,
        },
        warehouseImage,
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error adding warehouse: " + error.message,
    });
  }
};

exports.updateWarehouse = async (req, res) => {
  const { id } = req.params;
  const { name, street, city, cityId, province, provinceId, phoneNumber, OpenHour, CloseHour } = req.body;
  const address = `${street}, ${city}, ${province}`;

  try {
    // Convert address to coordinates
    console.log("Converting address to coordinates:", address);
    const apiKey = process.env.OPENCAGE_APIKEY;

    const openCageResponse = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`);
    const { results } = openCageResponse.data;

    const longitude = results[0].geometry.lng;
    const latitude = results[0].geometry.lat;

    // Fetch the warehouse instance
    let warehouse = await Warehouse.findOne({ where: { id } });

    if (!warehouse) {
      return res.status(404).json({ ok: false, message: "Warehouse not found." });
    }

    // Update properties
    warehouse.name = name;
    warehouse.location = address;
    warehouse.phoneNumber = phoneNumber;
    warehouse.OpenHour = OpenHour;
    warehouse.CloseHour = CloseHour;

    // Retrieve the uploaded image file, if available
    if (req.file) {
      warehouse.warehouseImage = req.file.filename; // Update the image
    } else {
      // Optional: handle the case where no image is uploaded
      // warehouse.warehouseImage = "default-image-path"; // Or leave it unchanged
    }

    // Save the changes
    await warehouse.save();

    // Update WarehouseAddress
    const warehouseAddress = await WarehouseAddress.update(
      {
        warehouseId: id,
        street,
        city,
        cityId,
        province,
        provinceId,
        longitude,
        latitude,
      },
      {
        where: {
          id,
        },
      }
    );

    // If coordinates not found, return error
    if (warehouseAddress.latitude === null || warehouseAddress.longitude === null) {
      return res.status(400).send("Invalid address or unable to find coordinates.");
    }

    res.json({
      ok: true,
      data: {
        name: warehouse.name,
        location: warehouse.location,
        cityId: warehouseAddress.cityId,
        provinceId: warehouseAddress.provinceId,
        coordinates: {
          latitude: warehouseAddress.latitude,
          longitude: warehouseAddress.longitude,
        },
        warehouseImage: warehouse.warehouseImage,
      },
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error updating warehouse: " + error.message,
    });
  }
};


exports.deleteWarehouse = async (req, res) => {
  const { id } = req.params;

  try {
    const warehouse = await Warehouse.destroy({
      where: {
        id,
      },
    });

    const warehouseAddress = await WarehouseAddress.destroy({
      where: {
        id,
      },
    });

    if (warehouse === 0 || warehouseAddress === 0) {
      return res.status(404).send({
        message: "Warehouse not found",
      });
    }

    res.json({
      ok: true,
      message: "Warehouse deleted",
    });
  } catch (error) {
    res.status(500).send({
      message: "Error deleting warehouse: " + error.message,
    });
  }
};

exports.assignWarehouseAdmin = async (req, res) => {
  const { warehouseId } = req.params;
  const { adminId } = req.body;

  try {
    const warehouse = await Warehouse.findByPk(warehouseId);
    const adminAcc = await Admin.findByPk(adminId);
    const isAssignedToAnotherWarehouse = await Warehouse.findOne({
      where: {
        adminId,
      },
    });

    if (!warehouse) {
      return res.status(404).json({
        ok: false,
        message: "Warehouse not found",
      });
    }

    // Check if admin exists
    if (!adminAcc || adminAcc.isWarehouseAdmin !== true) {
      return res.status(404).json({
        ok: false,
        message: "Admin not found or not a warehouse admin",
      });
    }

    // Check if warehouse already has an assigned admin
    if (warehouse.adminId) {
      return res.status(400).json({
        ok: false,
        message: "Warehouse already has an assigned admin",
      });
    }

    // Check if admin is already assigned to another warehouse
    if (isAssignedToAnotherWarehouse) {
      return res.status(400).json({
        ok: false,
        message: "Admin is already assigned to another warehouse",
      });
    }

    warehouse.adminId = adminId;

    await warehouse.save();

    return res.status(200).json({
      ok: true,
      message: "Warehouse admin assigned successfully",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error assigning warehouse admin",
      detail: String(error),
    });
  }
};

exports.unassignWarehouseAdmin = async (req, res) => {
  const { warehouseId } = req.params;

  try {
    const warehouse = await Warehouse.findByPk(warehouseId);

    if (!warehouse) {
      return res.status(404).json({
        ok: false,
        message: "Warehouse not found",
      });
    }

    if (!warehouse.adminId) {
      return res.status(400).json({
        ok: false,
        message: "Warehouse does not have an assigned admin",
      });
    }

    warehouse.adminId = null;

    await warehouse.save();

    return res.status(200).json({
      ok: true,
      message: "Warehouse admin unassigned successfully",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error unassigning warehouse admin",
      detail: String(error),
    });
  }
};

exports.getWarehouseById = async (req, res) => {
  const { id } = req.params;

  try {
    const warehouse = await Warehouse.findOne({
      where: {
        adminId: id,
      },
      include: {
        model: WarehouseAddress,
        attributes: ["street", "city", "cityId", "province", "provinceId", "longitude", "latitude"],
      },
    });

    if (!warehouse) {
      return res.status(404).json({
        ok: false,
        message: "Warehouse not found",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Get warehouse successfully",
      detail: warehouse,
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

exports.getWarehouseByAdmin = async (req, res) => {
  const { adminId } = req.params;

  try {
    const warehouse = await Warehouse.findOne({
      where: {
        adminId,
      },
      include: {
        model: Admin,
        attributes: ["id", "username"],
      },
    });

    if (!warehouse) {
      return res.status(404).json({
        ok: false,
        message: "Warehouse not found",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Get warehouse successfully",
      detail: warehouse,
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

exports.getNearestWarehouse = async (req, res) => {
  const { id: userId } = req.user;

  // Find the user with their default address
  const userAddress = await Address.findOne({
    attributes: ['street', 'city', 'cityId', 'province', 'provinceId', 'longitude', 'latitude'],
    where: {
      userId,
      setAsDefault: true,
    },
  });

  if (!userAddress) {
    return res.status(404).json({
      ok: false,
      message: 'User not found',
    });
  }

  // Extract user's latitude and longitude from the default address
  const userLatitude = userAddress.latitude;
  const userLongitude = userAddress.longitude;
  
  console.log(userLatitude, userLongitude);

  // Find the nearest warehouses
  const nearestWarehouses = await findNearestWarehouses(userLatitude, userLongitude);

  return res.status(200).json({
    ok: true,
    data: nearestWarehouses,
  });
};

async function findNearestWarehouses(userLatitude, userLongitude, radius = 8000) {
  const warehouses = await Warehouse.findAll({
    attributes: [
      'id',
      'name',
      [
        Sequelize.literal(
          `AVG(WarehouseAddress.latitude)`
        ),
        'latitude',
      ],
      [
        Sequelize.literal(
          `AVG(WarehouseAddress.longitude)`
        ),
        'longitude',
      ],
      [
        Sequelize.literal(
          `6371 * acos(cos(radians(${userLatitude})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${userLongitude})) + sin(radians(${userLatitude})) * sin(radians(latitude)))`
        ),
        'distance',
      ],
    ],
    include: [
      {
        model: WarehouseAddress,
        as: 'WarehouseAddress', // Use the correct alias
        attributes: ["cityId", "provinceId"],
      },
    ],
    group: ['Warehouse.id'], // Group by warehouse to get average latitude and longitude
    having: Sequelize.literal('distance <= ' + radius),
    order: Sequelize.literal('distance'),
  });

  return warehouses;
}