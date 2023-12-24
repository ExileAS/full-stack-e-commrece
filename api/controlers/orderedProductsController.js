const { OrderedProductModel } = require("../models/oderedProductsModel");
const crypto = require("crypto");
const {
  handleAddMain,
  handlePatchDeleteMain,
} = require("../helpers/mainProductsUpdates");
const { handleDeleteRedundant } = require("../helpers/deleteRedundantDocs");

module.exports.ordered_post = async (req, res) => {
  const { list, customerInfo, verifiedUser } = req.body;
  const updates = {};
  list.forEach(({ id, onhand }) => {
    updates[id] = onhand;
  });
  handleAddMain(updates);

  const confirmId = crypto.randomBytes(16).toString("hex");
  try {
    const productsOrdered = await OrderedProductModel.create({
      confirmId,
      list,
      customerInfo,
      delivered: false,
      customerPayed: false,
      shipmentStartedAt: verifiedUser ? Date.now() : null,
    });
    res.status(200).json({ confirmId });
  } catch (err) {
    console.log(err);
  }
};

module.exports.retreive_ordered_post = async (req, res) => {
  const { userEmail } = req.body;
  try {
    const orderedByUser = await OrderedProductModel.findOne({
      "customerInfo.userEmail": userEmail,
    });
    if (orderedByUser && orderedByUser.customerPayed) {
      const unpaidOrder = await OrderedProductModel.findOne({
        "customerInfo.userEmail": userEmail,
        customerPayed: false,
      });
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
            startedAt: orderedByUser.shipmentStartedAt?.toUTCString(),
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
          startedAt: orderedByUser.shipmentStartedAt?.toUTCString(),
        });
      } else {
        res.status(200).json({ orderInfo: "delivered" });
      }
    } else {
      res.status(404).json({ err: "order not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(404).json({ err: "error finding order" });
  }
};

module.exports.update_order_patch = async (req, res) => {
  const { confirmId, list, customerInfo, payedOrder } = req.body;

  const orderUpdates = { list, customerInfo, customerPayed: payedOrder };
  const updates = {};
  try {
    const orderedByUser = await OrderedProductModel.findOne({
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
      const response = await OrderedProductModel.findOneAndUpdate(
        { confirmId: confirmId },
        { $set: orderUpdates },
        { new: true, upsert: true }
      );
      if (payedOrder) {
        const newId =
          (await handleDeleteRedundant(customerInfo, list, confirmId)) ||
          confirmId;
        const response = await OrderedProductModel.findOneAndUpdate(
          { confirmId: confirmId },
          { $set: { confirmId: newId } }
        );
        res.status(200).json({ newId });
      }
    } else {
      res.status(404).json({ info: "no order found" });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports.order_delete = async (req, res) => {
  const { confirmId } = req.body;
  const updates = {};

  try {
    const orderedByUser = await OrderedProductModel.findOne({
      confirmId: confirmId,
    });

    if (orderedByUser) {
      orderedByUser.list.forEach(({ id, count }) => {
        updates[id] = count;
      });
      handlePatchDeleteMain(updates);
      await OrderedProductModel.deleteOne({ confirmId: confirmId });
      res.status(200).json({ success: true });
    } else {
      const err = new Error("order not found");
      err.code = 404;
      throw err;
    }
  } catch (err) {
    console.log(err);
    res.status(err.code).json({ err: err.message });
  }
};
