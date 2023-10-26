const stripe = require("stripe")(process.env.STRIPE_KEY);
const OrderedProducts = require("../models/oderedProductsModel");

module.exports.payment_post = async (req, res) => {
  const { confirmId } = req.body;
  try {
    const allOrdered = await OrderedProducts.find();
    const order = allOrdered.find((order) => order.confirmId === confirmId);
    const id = order._id;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: order.list.map((product) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
            },
            unit_amount: product.price,
          },
          quantity: product.count,
        };
      }),
      success_url: `http://localhost:3000/products/ordered/${id}`,
      cancel_url: "http://localhost:3000/products/ordered",
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports.confirm_payment = async (req, res) => {
  const { confirmId } = req.body;
  try {
    await OrderedProducts.findOneAndUpdate(
      { confirmId: confirmId },
      { $set: { customerPayed: true } }
    );
    res.status(200).json({ confirm: "payment confirmed" });
  } catch (err) {
    console.log(err);
  }
};
