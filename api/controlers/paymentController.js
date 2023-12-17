const { OrderedProductModel } = require("../models/oderedProductsModel");
const userModel = require("../models/userModel");
const createStripeSession = require("../services/stripe");

module.exports.payment_post = async (req, res) => {
  const { confirmId, totalAfterDiscount } = req.body;
  try {
    const order = await OrderedProductModel.findOne({ confirmId: confirmId });
    const session = await createStripeSession(order);

    const test = await userModel.findOneAndUpdate(
      { email: order.customerInfo.userEmail },
      { $set: { phoneNumber: order.customerInfo.phoneNumber } }
    );
    console.log(session);
    res.json({ url: session.url, id: order._id, totalAfterDiscount });
  } catch (err) {
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
    // res.status(400).json({ err });
    console.log(err);
  }
};

module.exports.update_user_orders = async (req, res) => {
  const { confirmId, currUser, order, totalPayment } = req.body;
  try {
    const user = await userModel.findOne({ email: currUser });
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
      userOrder = await userModel.findOneAndUpdate(
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
      userOrder = await userModel.findOneAndUpdate(
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
