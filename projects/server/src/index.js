const express = require("express");
const path = require("path")
const PORT = 8000;
const cors = require("cors")
require("dotenv").config({
  path: __dirname + "/../.env"
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "backend", "public")))

const authRouter = require("./routes/auth")


//Routing
app.use("/auth", authRouter)


app.use("/public", express.static(__dirname + "/public"));

//#region API ROUTES

// ===========================
// NOTE : Add your routes here

const { Product, Order, OrderItem } = require("../models");
const cartRoutes = require("../routes/cartRoutes");

app.use("/api/cart", cartRoutes);

app.get("/api", (req, res) => {
  res.send(`Hello, this is my API`);
});

app.use((req, res) => {
  console.log(`404: ${req.url}`);
  res.status(404).json({
    msg: "NOT FOUND",
  });
});

app.use((err, req, res) => {
  console.log(`500: ${res.url}`);
  console.log(err);
  res.status(500).json({
    msg: "FATAL ERROR",
    err,
  });
});

app.listen(PORT, () => {
  console.log(`application start on port ${PORT}`);
});
