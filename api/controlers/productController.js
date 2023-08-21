const Product = require("../models/productModel");
const OrderedProducts = require("../models/oderedProductsModel");
const crypto = require("crypto");

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

module.exports.ordered_post = async (req, res) => {
  const { list, customerInfo } = req.body;
  const uuid = crypto.randomUUID({ disableEntropyCache: true });

  const confirmId = uuid;

  const productsOrdered = await OrderedProducts.create({
    confirmId,
    list,
    customerInfo,
  });
  productsOrdered
    .save()
    .then((result) => res.status(200).json({ confirmId }))
    .catch((err) => console.log(err));
};

module.exports.retreive_ordered_post = async (req, res) => {
  const { userEmail } = req.body;
  //console.log(userEmail);
  try {
    const allOrdered = await OrderedProducts.find();
    const orderedByUser = allOrdered.find(
      ({ customerInfo }) => customerInfo.userEmail === userEmail
    );
    console.log(orderedByUser);
    res.status(200).json({ ordered: orderedByUser.list });
  } catch (err) {
    console.log(err);
    res.status(400).json({});
  }
};
