const { Category } = require("../src/models");

const categories = [
  { name: "Jackets", parentCategoryId: null },
  { name: "Tops", parentCategoryId: null },
  { name: "Bottom", parentCategoryId: null },
  { name: "Bags", parentCategoryId: null },
  { name: "Accessories", parentCategoryId: null },
];

Category.bulkCreate(categories)
  .then(() => console.log("Default categories created"))
  .catch((error) => console.error("Error creating default categories:", error));
