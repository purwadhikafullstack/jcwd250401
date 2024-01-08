const axios = require("axios");
const { Address, User } = require("../models");
const { Op } = require("sequelize");

// Config default axios with rajaongkir
axios.defaults.baseURL = "https://api.rajaongkir.com/starter";
axios.defaults.headers.common["key"] = process.env.RAJAONGKIR_APIKEY;
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

exports.handleGetProvince = async (req, res) => {
  try {
    const response = await axios.get("/province");
    const { results, status } = response.data.rajaongkir;

    if (status.code === 400) {
      return res.status(400).json({
        ok: false,
        message: "Bad request",
        detail: status.description,
      });
    }

    res.status(200).json({
      ok: true,
      detail: results,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Internal server error",
      detail: String(error),
    });
  }
};

exports.handleGetCityByProvinceId = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`/city?province=${id}`);
    const { results } = response.data.rajaongkir;

    res.status(200).json({
      ok: true,
      detail: results,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      detail: String(error),
    });
  }
};

exports.handleGetCity = async (req, res) => {
  try {
    const response = await axios.get("/city");
    const { results } = response.data.rajaongkir;

    res.status(200).json({
      ok: true,
      detail: results,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      detail: error,
    });
  }
};

exports.handleAddNewAddress = async (req, res) => {
  const { userId } = req.params;
  let { firstName, lastName, street, province, provinceId, city, cityId, district, subDistrict, phoneNumber, setAsDefault = false } = req.body;

  firstName = firstName;
  lastName = lastName;
  street = street.toString();
  province = province;
  city = city;

  try {
    const user = await User.findOne({ where: { id: userId } });

    if (user) {
      if (!street || !province || !city || !provinceId || !cityId || !district || !subDistrict || !phoneNumber || !firstName || !lastName) {
        return res.status(400).json({
          ok: false,
          message: "Please fill all required fields",
        });
      }

      const existingAddress = await Address.findOne({
        where: { userId: user.id, street },
      });

      if (existingAddress) {
        return res.status(400).json({
          ok: false,
          message: "Address already exists",
        });
      }

      const location = `${province}, ${city}`;
      const apiKey = process.env.OPENCAGE_APIKEY;

      const openCageResponse = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}`);
      const { results } = openCageResponse.data;

      const longitude = results[0].geometry.lng;
      const latitude = results[0].geometry.lat;

      const address = await Address.create({
        userId: user.id,
        firstName,
        lastName,
        street,
        city,
        cityId,
        district,
        subDistrict,
        province,
        provinceId,
        longitude,
        latitude,
        setAsDefault,
        phoneNumber,
      });

      if (setAsDefault) { // to make sure only one address is set as default
        await Address.update({ setAsDefault: false }, { where: { userId, id: { [Op.ne]: saveAddAddress.id } } });
      }

      res.status(201).json({
        ok: true,
        message: "Add new address successfully",
        detail: address,
      });
    }
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      detail: String(error),
    });
  }
};

exports.handleGetSingleUserAddress = async (req, res) => {
  const { userId } = req.params;

  try {
    const userAddressLists = await Address.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    if (!userAddressLists) {
      return res.status(404).json({
        ok: false,
        message: "User don't have any address",
      });
    }

    res.status(200).json({
      ok: true,
      detail: userAddressLists,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      detail: String(error),
    });
  }
};

exports.handleGetSpesificUserAddress = async (req, res) => {
  const { userId, addressId } = req.params;

  try {
    const userAddress = await Address.findOne({
      where: { id: addressId, userId },
    });

    res.status(200).json({
      ok: true,
      detail: userAddress,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      detail: String(error),
    });
  }
};

exports.handleDeleteAddress = async (req, res) => {
  const { userId, addressId } = req.params;

  try {
    const address = await Address.findOne({
      where: { id: addressId, userId },
    });

    if (!address) {
      return res.status(400).json({
        ok: false,
        message: "Address not found",
      });
    }

    await address.destroy();

    res.status(200).json({
      ok: true,
      message: "Delete address successfully",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      detail: String(error),
    });
  }
};

exports.handleUpdateAddress = async (req, res) => {
  const { userId, addressId } = req.params;
  const { firstName, lastName, street, province, city, provinceId, cityId, district, subDistrict, phoneNumber, setAsDefault } = req.body;

  try {
    const address = await Address.findOne({
      where: { id: addressId, userId },
    });

    if (!address) {
      return res.status(404).json({
        ok: false,
        message: "Address not found",
      });
    }

    const location = `${province}, ${city}`;
    const apiKey = process.env.OPENCAGE_APIKEY;

    const openCageResponse = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(location)}&key=${apiKey}`);
    const { results } = openCageResponse.data;

    const longitude = results[0].geometry.lng;
    const latitude = results[0].geometry.lat;

    if (firstName) {
      address.firstName = firstName;
    }
    if (lastName) {
      address.lastName = lastName;
    }
    if (street) {
      address.street = street;
    }
    if (city) {
      address.city = city;
    }
    if (province) {
      address.province = province;
    }
    if (provinceId) {
      address.provinceId = provinceId;
    }
    if (cityId) {
      address.cityId = cityId;
    }
    if (district) {
      address.district = district;
    }
    if (subDistrict) {
      address.subDistrict = subDistrict;
    }
    if (phoneNumber) {
      address.phoneNumber = phoneNumber;
    }

    if (setAsDefault) {
      address.setAsDefault = setAsDefault;
    }

    address.longitude = longitude;
    address.latitude = latitude;

    await Address.update({ setAsDefault: false }, { where: { userId } });
    await Address.update({ setAsDefault }, { where: { id: addressId } });
    await address.save();

    res.status(200).json({
      ok: true,
      message: "Update address successfully",
      detail: address,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Internal server error",
      detail: String(error),
    });
  }
};
