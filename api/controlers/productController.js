const Product = require("../models/productModel");
const OrderedProducts = require("../models/oderedProductsModel");
const crypto = require("crypto");

module.exports.product_get = (req, res) => {
  try {
    Product.find()
      .sort({ createdAt: -1 })
      .then((result) => res.status(200).json({ result }));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports.product_post = async (req, res) => {
  const productDetails = req.body;
  try {
    const date = new Date().toISOString();
    const product = await Product.create({ ...productDetails, date });
    await product.save();
    res.redirect("/");
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
    delivered: false,
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
    if (orderedByUser) {
      if (orderedByUser.delivered === false) {
        res.status(200).json({
          ordered: orderedByUser.list,
          customerInfo: orderedByUser.customerInfo,
        });
      } else {
        res.status(200).json({ orderInfo: "delivered" });
      }
    } else {
      res.status(400).json({ error: "nothing ordered" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      error: "error finding order",
    });
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
