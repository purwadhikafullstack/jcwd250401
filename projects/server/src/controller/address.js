const axios = require("axios");

// Config default axios with rajaongkir
axios.defaults.baseURL = "https://api.rajaongkir.com/starter";
axios.defaults.headers.common["key"] = process.env.RAJAONGKIR_APIKEY;
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

exports.handleGetProvince = async (req, res) => {
  try {
    const response = await axios.get("/province");
    const { results } = response.data.rajaongkir;

    res.status(200).json({
      ok: true,
      detail: results,
    });
  } catch (error) {
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
      msg: "Internal server error",
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
      msg: "Internal server error",
      detail: String(error),
    });
  }
};

exports.handleGetCost = async (req, res) => {
  try {
    const { origin, destination, weight, courier } = req.body;
    const response = await axios.post("/cost", {
      origin,
      destination,
      weight,
      courier,
    });

    console.log(response.data);
    const { results } = response.data.rajaongkir;

    res.status(200).json({
      ok: true,
      detail: results,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Internal server error",
      detail: String(error),
    });
  }
};
