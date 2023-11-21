const express = require("express");
const path = require("path");
const PORT = 8000;
const cors = require("cors");
require("dotenv").config({
  path: __dirname + "/../.env",
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "backend", "public")));

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const addressRouter = require("./routes/address");
const categoryRouter = require("./routes/category");
const orderRouter = require("./routes/order");
const productRouter = require("./routes/product");
const userRouter = require("./routes/user")
const cartRoutes = require("./routes/cartRoutes");
const WarehouseRoutes = require("./routes/warehouse");

//Routing
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/address", addressRouter);
app.use("/category", categoryRouter);
app.use("/order", orderRouter);
app.use("/product", productRouter);
app.use("/users", userRouter)
app.use("/api/cart", cartRoutes);
app.use("/api/warehouse", WarehouseRoutes);

app.use("/public", express.static(__dirname + "/public"));

//#region API ROUTES

// ===========================
// NOTE : Add your routes here

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
  console.log(`APP RUNNING at ${PORT} ✅`);
});
