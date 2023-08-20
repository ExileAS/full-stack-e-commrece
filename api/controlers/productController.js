const Product = require("../models/productModel");
const OrderedProducts = require("../models/oderedProductsModel");

module.exports.product_get = (req, res) => {
  try {
    Product.find()
      .sort({ createdAt: -1 })
      .then((result) => res.status(200).json({ result }))
      .catch((err) => console.log(err));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports.product_post = (req, res) => {
  try {
    const product = new Product(req.body);
    product.save();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports.ordered_post = (req, res) => {
  try {
    const productsOrdered = new OrderedProducts(req.body);
    productsOrdered.save().then((result) => res.status(200));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
