const Product = require("../models/productModel");
const OrderedProducts = require("../models/oderedProductsModel");
const crypto = require("crypto");

const handleAddDeleteMain = (updates) => {
  for (let id in updates) {
    async function update() {
      const result = await Product.findOneAndUpdate(
        { id: id },
        { onhand: updates[id] }
      );
      //console.log(result);
    }
    update();
  }
};

const handlePatchMain = (updates) => {
  for (let id in updates) {
    async function update() {
      const result = await Product.findOneAndUpdate(
        { id: id },
        { $inc: { onhand: updates[id] } }
      );
      console.log(result);
    }
    update();
  }
};

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
  const updates = {};
  list.forEach(({ id, onhand }) => {
    updates[id] = onhand;
  });
  handleAddDeleteMain(updates);

  const randomId = crypto.randomBytes(16).toString("hex");
  const confirmId = randomId;

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
      res.status(404);
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
  const orderUpdates = { list, customerInfo };
  const updates = {};
  try {
    const allOrdered = await OrderedProducts.find();
    const orderedByUser = allOrdered.find(
      (order) => order.confirmId === confirmId
    );

    if (orderedByUser) {
      orderedByUser.list.forEach(({ id, count }) => {
        updates[id] = count;
      });
      list.forEach(({ id, count }) => {
        updates[id] = updates[id] ? updates[id] - count : -count;
      });
      handlePatchMain(updates);

      const res = await OrderedProducts.updateOne(
        { confirmId: confirmId },
        { $set: orderUpdates }
      );
    } else {
      console.log("no order found");
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.order_delete = async (req, res) => {
  const { confirmId } = req.body;
  const updates = {};

  try {
    const allOrdered = await OrderedProducts.find();
    const orderedByUser = allOrdered.find(
      (order) => order.confirmId === confirmId
    );

    if (orderedByUser) {
      orderedByUser.list.forEach(({ id, onhand, count }) => {
        updates[id] = onhand + count;
      });
      handleAddDeleteMain(updates);
      const res = await OrderedProducts.deleteOne({ confirmId: confirmId });
    } else {
      console.log("no order found");
    }
  } catch (err) {
    console.log(err);
  }
};
