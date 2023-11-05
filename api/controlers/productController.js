const Product = require("../models/productModel");
const OrderedProducts = require("../models/oderedProductsModel");
const crypto = require("crypto");
const path = require("path");

const handleAddMain = (updates) => {
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

const handlePatchDeleteMain = async (updates) => {
  for (let id in updates) {
    async function update() {
      const result = await Product.findOneAndUpdate(
        { id: id },
        { $inc: { onhand: updates[id] } }
      );
    }
    update();
  }
};

const handleDeleteRedundant = async (info, list, confirmId) => {
  const { userEmail } = info;
  try {
    const existingOrder = await OrderedProducts.findOne({
      "customerInfo.userEmail": userEmail,
    });
    if (!existingOrder) return;
    if (existingOrder.confirmId === confirmId) {
      console.log("wrong");
      return;
    }
    const existingList = existingOrder.list;
    const existingId = existingOrder._id;
    let count = 0;
    for (let p of existingList) {
      let redundant = list.find(({ id }) => p.id === id);
      if (redundant) count++;
    }

    if (count === existingList.length) {
      //console.log("deleted");
      const res = await OrderedProducts.deleteOne({ _id: existingId });
      console.log("redundant delete result:" + res);
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.product_get = async (req, res) => {
  try {
    const result = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ result });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

module.exports.product_post = async (req, res) => {
  const productDetails = req.body;
  const { img } = req.files;
  const imgPath = path.join(__dirname, "..", "images" + "/" + img.name);
  img.mv(imgPath);
  try {
    const date = new Date().toISOString();
    const product = await Product.create({
      ...productDetails,
      date,
      img: img.name,
    });
    await product.save();
    res.status(200).json({});
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
  //console.log(updates);
  handleAddMain(updates);

  const randomId = crypto.randomBytes(16).toString("hex");
  const confirmId = randomId;

  const productsOrdered = await OrderedProducts.create({
    confirmId,
    list,
    customerInfo,
    delivered: false,
    customerPayed: false,
  });
  productsOrdered
    .save()
    .then((result) => res.status(200).json({ confirmId }))
    .catch((err) => console.log(err));
};

module.exports.retreive_ordered_post = async (req, res) => {
  const { userEmail } = req.body;
  try {
    const orderedByUser = await OrderedProducts.findOne({
      "customerInfo.userEmail": userEmail,
    });
    if (orderedByUser && orderedByUser.customerPayed) {
      const unpaidOrder = await OrderedProducts.findOne({
        "customerInfo.userEmail": userEmail,
        customerPayed: false,
      });
      // console.log(unpaidOrder);
      if (unpaidOrder) {
        if (unpaidOrder.delivered && orderedByUser.delivered) {
          res.status(200).json({ orderInfo: "delivered" });
        } else {
          res.status(200).json({
            isSplit: true,
            orderedPaid: orderedByUser.list,
            orderedUnpaid: unpaidOrder.list,
            customerInfo: orderedByUser.customerInfo,
            orderId: unpaidOrder.confirmId,
            payedId: orderedByUser.confirmId,
          });
        }
        return;
      }
    }

    if (orderedByUser) {
      if (orderedByUser.delivered === false) {
        res.status(200).json({
          ordered: orderedByUser.list,
          customerInfo: orderedByUser.customerInfo,
          orderId: orderedByUser.confirmId,
          payed: orderedByUser.customerPayed,
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
  const { confirmId, list, customerInfo, payedOrder, isSplit } = req.body;
  const orderUpdates = { list, customerInfo, customerPayed: payedOrder };
  const updates = {};
  console.log("order patch updates: " + orderUpdates.payedOrder);
  try {
    const orderedByUser = await OrderedProducts.findOne({
      confirmId: confirmId,
    });

    if (orderedByUser) {
      orderedByUser.list.forEach(({ id, count }) => {
        updates[id] = count;
      });
      list.forEach(({ id, count }) => {
        updates[id] = updates[id] ? updates[id] - count : -count;
      });
      //console.log(updates);
      if (!payedOrder) handlePatchDeleteMain(updates);
      const res = await OrderedProducts.findOneAndUpdate(
        { confirmId: confirmId },
        { $set: orderUpdates },
        { new: true, upsert: true }
      );
      if (payedOrder) handleDeleteRedundant(customerInfo, list, confirmId);
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
    const orderedByUser = await OrderedProducts.findOne({
      confirmId: confirmId,
    });

    if (orderedByUser) {
      orderedByUser.list.forEach(({ id, count }) => {
        updates[id] = count;
      });
      //console.log(updates);
      handlePatchDeleteMain(updates);
      const res = await OrderedProducts.deleteOne({ confirmId: confirmId });
    } else {
      console.log("no order found");
    }
  } catch (err) {
    console.log(err);
  }
};
