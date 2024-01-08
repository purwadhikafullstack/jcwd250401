const { Admin } = require("../models");

const adminData = {
  username: "admin",
  email: "superAdmin@gmail.com",
  password: "$2b$10$g4vbvxSw4x9wwCs081Z3lunIhqWtObh6DFidhnHHbuLcxxO5/gQ3O",
  photoProfile: null,
  uniqueCode: null,
  uniqueCodeCreatedAt: null,
  isWarehouseAdmin: false,
};

Admin.create(adminData)
  .then(() => console.log("Admin created"))
  .catch((error) => console.error("Error creating admin:", error));
