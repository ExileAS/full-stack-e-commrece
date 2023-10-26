const stripe = require("stripe")(process.env.STRIPE_KEY);
const OrderedProducts = require("../models/oderedProductsModel");

module.exports.payment_post = async (req, res) => {
  const { confirmId } = req.body;
  try {
    const allOrdered = await OrderedProducts.find();
    const order = allOrdered.find((order) => order.confirmId === confirmId);
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
      success_url: `http://localhost:3000/products/ordered/${confirmId}`,
      cancel_url: "http://localhost:3000/products/ordered",
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
