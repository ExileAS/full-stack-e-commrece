const { ProductModel } = require("../models/productModel");

module.exports.product_get = async (req, res) => {
  console.log("request recieved");
  try {
    const result = await ProductModel.find().sort({ createdAt: -1 });
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
    const order = await ProductModel.find({ id: { $in: ids } });
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
