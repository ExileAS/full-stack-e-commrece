const { OrderedProductModel } = require("../models/oderedProductsModel");
const { userModel } = require("../models/userModel");
const createStripeSession = require("../services/stripe");
const logger = require("../logs/winstonLogger");
const sellerModel = require("../models/sellerModel");

module.exports.payment_post = async (req, res) => {
  const { confirmId, totalAfterDiscount, isSeller } = req.body;
  try {
    const order = await OrderedProductModel.findOne({ confirmId: confirmId });
    const session = await createStripeSession(order);

    const model = isSeller ? sellerModel : userModel;

    await model.findOneAndUpdate(
      { email: order.customerInfo.userEmail, phoneNumber: { $exists: false } },
      { $set: { phoneNumber: order.customerInfo.phoneNumber } }
    );
    res.json({ url: session.url, id: order._id, totalAfterDiscount });
  } catch (err) {
    logger.error(
      `stripe sesion failed: \nconfirmId: ${confirmId} \nerror: ${err}`
    );
    res.status(500).json({ err: err.message });
  }
};

module.exports.confirm_payment = async (req, res) => {
  const { confirmId, currUser } = req.body;

  try {
    const original = await OrderedProductModel.findOne({
      confirmId: confirmId,
      "customerInfo.userEmail": currUser,
    });
    const order = await OrderedProductModel.findOneAndUpdate(
      { confirmId: confirmId, "customerInfo.userEmail": currUser },
      {
        $set: {
          customerPayed: true,
          ...(original.shipmentStartedAt !== null
            ? {}
            : { shipmentStartedAt: Date.now() }),
        },
      },
      { new: true }
    );

    const totalPayment = order.list.reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    order.total = totalPayment;
    await order.save();
    res.status(200).json({
      startedAt: order.shipmentStartedAt?.toUTCString(),
      order,
      totalPayment,
    });
  } catch (err) {
    logger.error(
      `payment confirmation failed: \nuser: ${currUser} \nconfirmId: ${confirmId} \nerror: ${err}`
    );
    res.status(400).json({ err });
    console.log(err);
  }
};

module.exports.update_user_orders = async (req, res) => {
  const { confirmId, currUser, order, totalPayment, isSeller } = req.body;
  const model = isSeller ? sellerModel : userModel;
  try {
    const user = await model.findOne({ email: currUser });
    const existingOrder = user?.orders.find(
      (order) => order.orderId === confirmId
    );

    const newOrder = {
      orderId: confirmId,
      list: order.list,
      total: totalPayment,
    };
    let userOrder;
    if (existingOrder) {
      userOrder = await model.findOneAndUpdate(
        {
          email: currUser,
          orders: {
            $elemMatch: { orderId: confirmId },
          },
        },
        { $set: { "orders.$": newOrder } },
        { new: true }
      );
    } else {
      console.log("new");
      userOrder = await model.findOneAndUpdate(
        { email: currUser },
        {
          $push: { orders: newOrder },
          $inc: { purchaseCount: 1 },
        },
        { new: true }
      );
    }
    const totalUserPayments = userOrder.orders.reduce(
      (acc, order) => acc + order.total,
      0
    );
    userOrder.totalPayments = totalUserPayments;
    await userOrder.save();
    res.status(201).json({ total: totalUserPayments });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
};
