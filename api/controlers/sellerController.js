const { ProductModel } = require("../models/productModel");
const path = require("path");
const fs = require("fs");
const { detectExplicit } = require("../services/EdenAi");

module.exports.get_all_sellers = async (req, res) => {
  try {
    const allProducts = await ProductModel.find();
    const sellers = allProducts.map(({ seller }) => seller);
    res.status(200).json({ sellerList: sellers });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

module.exports.product_post = async (req, res) => {
  const productDetails = req.body;
  const { img } = req.files;
  const imgPath = path.join(__dirname, "..", "images" + "/" + img.name);
  img.mv(imgPath);
  const edenResSafe = await detectExplicit(imgPath, req.body.seller);
  if (!edenResSafe) {
    res.status(400).json({ explicit: true });
    return;
  }
  try {
    const date = new Date().toISOString();
    const product = await ProductModel.create({
      ...productDetails,
      date,
      img: img.name,
    });
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

module.exports.edit_product = async (req, res) => {
  const { name, description, price, onhand, id, seller, category } = req.body;
  const { img } = req.files;
  const existing = await ProductModel.findOne({ id: id, seller: seller });
  const prevImg = existing.img;
  const prevImgPath = path.join(__dirname, "..", "images" + "/" + prevImg);
  if (prevImg !== img.name) {
    fs.stat(prevImgPath, (err, stats) => {
      if (err) return console.log(err);

      fs.unlink(prevImgPath, (err) => {
        if (err) return console.log(err);
        console.log("file deleted");
      });
    });
  }
  const imgPath = path.join(__dirname, "..", "images" + "/" + img.name);
  img.mv(imgPath);
  const edenResSafe = await detectExplicit(imgPath, seller);
  if (!edenResSafe) {
    return res.status(403).json({ explicit: true });
  }
  const updates = { name, description, price, onhand, img: img.name, category };
  try {
    const response = await ProductModel.findOneAndUpdate(
      { id: id, seller: seller },
      { $set: updates },
      { new: true, upsert: true }
    );
    res.status(200).json({ id });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};
