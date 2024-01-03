const stripe = require("stripe")(process.env.STRIPE_KEY);

const createStripeSession = async (order) => {
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
    success_url: `${process.env.CLIENT_URI_PROD}/products/ordered/confirmed/${order._id}`,
    cancel_url: `${process.env.CLIENT_URI_PROD}/products/ordered/checkout`,
  });
  return session;
};

module.exports = createStripeSession;
