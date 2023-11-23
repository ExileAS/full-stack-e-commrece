const OrderedProducts = require("../models/oderedProductsModel");
const crypto = require("crypto");
const {
  handleAddMain,
  handlePatchDeleteMain,
} = require("../utils/mainProductsUpdates");
const { handleDeleteRedundant } = require("../utils/deleteRedundantOrders");

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
    res.status(404).json({
      error: "error finding order",
    });
  }
};

module.exports.update_order_patch = async (req, res) => {
  const { confirmId, list, customerInfo, payedOrder } = req.body;
  const orderUpdates = { list, customerInfo, customerPayed: payedOrder };
  const updates = {};
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
      handlePatchDeleteMain(updates);
      const res = await OrderedProducts.deleteOne({ confirmId: confirmId });
    } else {
      console.log("no order found");
    }
  } catch (err) {
    console.log(err);
  }
};