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
  const uuid = crypto.randomUUID();

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
  try {
    const allOrdered = await OrderedProducts.find();
    const orderedByUser = allOrdered.find(
      ({ customerInfo }) => customerInfo.userEmail === userEmail
    );
    res.status(200).json({
      ordered: orderedByUser.list,
      customerInfo: orderedByUser.customerInfo,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({});
  }
};

module.exports.update_order_patch = async (req, res, next) => {
  const { confirmId, list, customerInfo } = req.body;
  const updates = { list, customerInfo };
  try {
    const allOrdered = await OrderedProducts.find();
    const orderedByUser = allOrdered.find(
      (order) => order.confirmId === confirmId
    );

    if (orderedByUser) {
      const res = await OrderedProducts.updateOne(
        { confirmId: confirmId },
        { $set: updates }
      );
      console.log(res);
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.order_delete = async (req, res) => {
  const { confirmId } = req.body;

  try {
    const allOrdered = await OrderedProducts.find();
    const orderedByUser = allOrdered.find(
      (order) => order.confirmId === confirmId
    );

    if (orderedByUser) {
      const res = await OrderedProducts.deleteOne({ confirmId: confirmId });
      console.log(res);
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
  }
};
