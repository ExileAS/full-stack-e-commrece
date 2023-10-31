const ProductModel = require("../models/productModel");

module.exports.get_all_sellers = async (req, res) => {
  try {
    const allProducts = await ProductModel.find();
    const sellers = allProducts.map(({ seller }) => seller);
    res.status(200).json({ sellerList: sellers });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};
