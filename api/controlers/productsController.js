const Product = require("../models/productModel");

module.exports.product_get = async (req, res) => {
  try {
    const result = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ result });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err: err.message });
  }
};

module.exports.confirm_available = async (req, res) => {
  const list = req.body;
  const ids = list.map(({ id }) => id);

  try {
    const order = await Product.find({ id: { $in: ids } });
    const outOfStockIds = order
      .filter((product) => product.onhand <= 0)
      .map(({ id }) => id);

    if (outOfStockIds.length) {
      res.status(404).json({ err: outOfStockIds });
    } else {
      res.status(200).json({});
    }
  } catch (error) {
    console.log(error);
  }
};
