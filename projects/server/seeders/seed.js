const { Category } = require("../src/models");

const categories = [
  { name: "Men", parentCategoryId: null },
  { name: "Women", parentCategoryId: null },
  { name: "Jackets", parentCategoryId: 1 },
  { name: "Tops", parentCategoryId: 1 },
  { name: "Bottom", parentCategoryId: 1 },
  { name: "Jackets", parentCategoryId: 2 },
  { name: "Tops", parentCategoryId: 2 },
  { name: "Bottom", parentCategoryId: 2 },
  { name: "Bags", parentCategoryId: null },
  { name: "Accessories", parentCategoryId: null },
];

Category.bulkCreate(categories)
  .then(() => console.log("Default categories created"))
  .catch((error) => console.error("Error creating default categories:", error));
