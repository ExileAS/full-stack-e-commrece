const { OrderedProductModel } = require("../models/oderedProductsModel");
const userModel = require("../models/userModel");
const createStripeSession = require("../services/stripe");

module.exports.payment_post = async (req, res) => {
  const { confirmId } = req.body;
  try {
    const order = await OrderedProductModel.findOne({ confirmId: confirmId });
    const session = await createStripeSession(order);
    res.json({ url: session.url, id: order._id });

    const updated = await order.save();
    const userPhoneNumber = updated.customerInfo.phoneNumber;
    const userEmail = updated.customerInfo.userEmail;
    await userModel.findOneAndUpdate(
      { email: userEmail },
      { $set: { phoneNumber: userPhoneNumber } }
    );
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
      }
    );

    const updatedOrder = await order.save();
    res.status(200).json({
      startedAt: updatedOrder.shipmentStartedAt?.toUTCString(),
    });
    const totalPayment = updatedOrder.list.reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    const updatedPaymentOrder = await OrderedProductModel.findByIdAndUpdate(
      { _id: updatedOrder._id },
      { $set: { total: totalPayment } }
    );
    const user = await userModel.findOne({ email: currUser });
    const existingOrder = user?.orders.find(
      (order) => order.orderId === confirmId
    );

    const newOrder = {
      orderId: confirmId,
      list: updatedPaymentOrder.list,
      total: totalPayment,
    };

    let userOrder;

    if (existingOrder) {
      userOrder = await userModel.findOneAndUpdate(
        { email: currUser, "orders.orderId": confirmId },
        { $set: { "orders.$": newOrder } }
      );
    } else {
      console.log("new");
      userOrder = await userModel.findOneAndUpdate(
        { email: currUser },
        {
          $push: { orders: newOrder },
          $inc: { purchaseCount: 1 },
        }
      );
    }
    const updated = await userOrder.save();
    const totalUserPayments = updated.orders.reduce(
      (acc, order) => acc + order.total,
      0
    );

    await userModel.findByIdAndUpdate(
      { _id: userOrder._id },
      { $set: { totalPayments: totalUserPayments } }
    );
  } catch (err) {
    // res.status(400).json({ err });
    console.log(err);
  }
};
