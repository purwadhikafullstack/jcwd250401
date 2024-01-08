const { User, Cart, CartItem, Product, Wishlist, WishlistProduct, ProductImage, Mutation, Warehouse, Category, ProductCategory } = require("../models");

exports.handleAddToWishlist = async (req, res) => {
  const { id: userId } = req.user;
  const { productId } = req.body; // Assuming productId is passed as a body parameter

  try {
    if (!userId) {
      return res.status(403).json({
        ok: false,
        message: "Please login first.",
      });
    }

    let wishlist = await Wishlist.findOne({
      where: {
        userId,
      },
      include: [
        {
          model: WishlistProduct,
        },
      ],
    });

    // If wishlist not found, create a new one
    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId,
      });

      // Optionally, fetch the wishlist again to include products
      wishlist = await Wishlist.findByPk(wishlist.id, {
        include: [
          {
            model: WishlistProduct,
          },
        ],
      });
    }

    const wishlistProduct = await WishlistProduct.findOne({
      where: {
        wishlistId: wishlist.id,
        productId: productId,
      },
    });

    if (wishlistProduct) {
      return res.status(400).json({
        ok: false,
        message: "Product already in wishlist",
      });
    }

    await WishlistProduct.create({
      wishlistId: wishlist.id,
      productId: productId,
    });

    return res.status(200).json({
      ok: true,
      message: "Product added to wishlist",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

const getProductStock = async (productId) => {
  try {
    const product = await Product.findOne({
      where: { id: productId },
      attributes: ["id", "price", "name", "description", "gender", "weight", "sku", "createdAt", "updatedAt"],
      include: [
        {
          model: ProductImage,
          as: "productImages",
          attributes: ["id", "imageUrl"],
        },
      ],
    });

    if (!product) {
      console.error(`Product not found for productId ${productId}`);
      throw new Error(`Product not found for productId ${productId}`);
    }

    const warehouses = await Warehouse.findAll();

    const mutations = await Promise.all(
      warehouses.map(async (warehouse) => {
        try {
          const latestMutation = await Mutation.findOne({
            attributes: ["stock"],
            where: {
              productId: product.id,
              warehouseId: warehouse.id,
            },
            order: [["createdAt", "DESC"]],
            limit: 1,
          });

          return {
            warehouseId: warehouse.id,
            warehouseName: warehouse.name,
            totalStock: latestMutation ? latestMutation.stock : 0,
          };
        } catch (mutationError) {
          console.error(`Error in getProductStock for productId ${product.id} and warehouseId ${warehouse.id}:`, mutationError);
          throw mutationError;
        }
      })
    );

    // Calculate the total stock from all warehouses
    const totalStockAllWarehouses = mutations.reduce((total, mutation) => total + mutation.totalStock, 0);

    return {
      ...product.toJSON(),
      Mutations: mutations || [],
      totalStockAllWarehouses: totalStockAllWarehouses || 0,
    };
  } catch (error) {
    console.error(`Error in getProductStock for productId ${productId}:`, error);
    throw error; // Rethrow the error to be caught by the caller
  }
};

const calculateProductStock = async (productId) => {
  const productStock = await getProductStock(productId);
  return productStock;
};

exports.handleGetWishlist = async (req, res) => {
  const { id: userId } = req.user;

  try {
    if (!userId) {
      return res.status(403).json({
        ok: false,
        message: "Please login first.",
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "User not found",
      });
    }

    const wishlist = await Wishlist.findOne({
      where: {
        userId,
      },
      include: [
        {
          model: WishlistProduct,
          include: [
            {
              model: Product,
              include: [
                {
                  model: ProductImage,
                  as: "productImages",
                },
              ],
            },
          ],
        },
      ],
      order: [
        [WishlistProduct, "createdAt", "DESC"], // Order WishlistProducts by createdAt in descending order
      ],
    });

    // Check if wishlist is found
    if (!wishlist) {
      return res.status(404).json({
        ok: false,
        message: "Wishlist not found",
      });
    }

    // Retrieve product stock and category information for each product in the wishlist
    const productsWithInfo = await Promise.all(
      wishlist.WishlistProducts.map(async (wishlistProduct) => {
        const productId = wishlistProduct.Product.id;
        const productStock = await calculateProductStock(productId);

        // Fetch categories associated with the product
        const allCategories = await ProductCategory.findAll({
          where: { productId },
          include: [{ model: Category, as: "Category", attributes: ["id", "name"] }],
        });

        // Organize categories by product ID for efficient mapping
        const categoriesByProductId = {};
        allCategories.forEach((productCategory) => {
          const { productId, Category } = productCategory;
          if (!categoriesByProductId[productId]) {
            categoriesByProductId[productId] = [];
          }
          categoriesByProductId[productId].push(Category);
        });

        return {
          ...wishlistProduct.toJSON(),
          Product: {
            ...productStock,
            Categories: categoriesByProductId[productId] || [],
          },
        };
      })
    );

    return res.status(200).json({
      ok: true,
      message: "Wishlist found",
      detail: {
        ...wishlist.toJSON(),
        WishlistProducts: productsWithInfo,
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};
exports.handleDeleteWishlistProduct = async (req, res) => {
  const { id: userId } = req.user;
  const { productId } = req.params; // Assuming productId is passed as a URL parameter

  try {
    if (!userId) {
      return res.status(403).json({
        ok: false,
        message: "Please login first.",
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "User not found",
      });
    }

    const wishlist = await Wishlist.findOne({
      where: {
        userId,
      },
      include: [
        {
          model: WishlistProduct,
        },
      ],
    });

    // Check if wishlist is found
    if (!wishlist) {
      return res.status(404).json({
        ok: false,
        message: "Wishlist not found",
      });
    }

    const wishlistProduct = await WishlistProduct.findOne({
      where: {
        wishlistId: wishlist.id,
        productId: productId,
      },
    });

    if (!wishlistProduct) {
      return res.status(400).json({
        ok: false,
        message: "Product not found in wishlist",
      });
    }

    await wishlistProduct.destroy();

    return res.status(200).json({
      ok: true,
      message: "Product removed from wishlist",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};
