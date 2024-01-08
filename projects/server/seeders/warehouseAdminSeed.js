const { Admin } = require("../models");

const adminData = {
  username: "warehouseAdmin",
  email: "warehouseAdmin@gmail.com",
  password: "$2b$10$g4vbvxSw4x9wwCs081Z3lunIhqWtObh6DFidhnHHbuLcxxO5/gQ3O",
  photoProfile: null,
  uniqueCode: null,
  uniqueCodeCreatedAt: null,
  isWarehouseAdmin: true,
};

Admin.create(adminData)
  .then(() => console.log("Warehouse Admin created"))
  .catch((error) => console.error("Error creating warehouse admin:", error));
