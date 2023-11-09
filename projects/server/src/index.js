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

//Routing
app.use("/auth", authRouter);
app.use("/profile", profileRouter);

app.use("/public", express.static(__dirname + "/public"));

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
