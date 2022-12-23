const _ = require("lodash");
const Product = require("../models/product");
const Category = require("../models/category");
const { all } = require("../routes");

module.exports = {
  getHome: async (req, res) => {
    try {
      const allCategories = await Category.find();
      const latestProducts = await Product.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .exec();
      const featuredProducts = await Product.find({ isFeatured: true })
        .populate("category")
        .sort({ createdAt: -1 })
        .exec();

      res.render("master/home", {
        allCategories: allCategories,
        featuredProducts: featuredProducts,
        latestProducts: latestProducts,
      });
    } catch (err) {
      console.log(err);
      res.render("errorPage/error", { layout: false });
    }
  },

  getAllProducts: async (req, res) => {
    try {
      // TODO: pagination and sorting
      const allCategories = await Category.find();
      const latestProducts = await Product.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .exec();

      const offerProducts = await Product.find({
        offerPrice: { $ne: null },
      }).limit(6);
      // const allProducts = await Product.find().populate("category").where("price").equals()

      res.render("master/shop", {
        allCategories: allCategories,
        offerProducts: offerProducts,
        latestProducts: latestProducts,
      });
    } catch (err) {
      console.log(err);
      res.render("errorPage/error", { layout: false });
    }
  },

  getShopByCategory: async (req, res) => {
    try {
      const allCategories = await Category.find();
      const paramsId = _.upperFirst(req.params.category);
      const findCategory = await Category.find({ categoryName: paramsId });

      const latestProducts = await Product.find({
        category: findCategory[0].id,
      })
        .sort({ createdAt: -1 })
        .limit(6);

      res.render("master/category", {
        allCategories: allCategories,
        latestProducts: latestProducts,
        findCategory: findCategory,
      });
    } catch (err) {
      console.log(err);
      res.render("errorPage/error", { layout: false });
    }
  },

  getProductById: async (req, res) => {
    try {
      const productId = req.params.id;
      const allCategories = await Category.find();

      const isInMyList = await Wishlist.exists()
        .where("userId")
        .equals(req.user?.id)
        .where("myList.productId")
        .equals(productId);

      const findProduct = await Product.findById(productId)
        .populate("category")
        .exec();

      if (findProduct) {
        res.res("master/productDetails", {
          findProduct: findProduct,
          allCategories: allCategories,
          isInMyList: isInMyList,
        });
      } else {
        res.render("errorPage/error", { layout: false });
      }
    } catch (err) {
      console.log(err);
      res.render("errorPage/error", { layout: false });
    }
  },
};
