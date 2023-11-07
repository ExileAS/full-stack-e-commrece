const Product = require("../models/productModel");
const path = require("path");
const fs = require("fs");
const { detectExplicit } = require("../services/EdenAi");

module.exports.get_all_sellers = async (req, res) => {
  try {
    const allProducts = await Product.find();
    const sellers = allProducts.map(({ seller }) => seller);
    res.status(200).json({ sellerList: sellers });
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

module.exports.edit_product = async (req, res) => {
  const { name, description, price, onhand, id, seller, category } = req.body;
  const { img } = req.files;
  const existing = await Product.findOne({ id: id, seller: seller });
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
  const edenResSafe = await detectExplicit(imgPath);
  if (!edenResSafe) {
    res.status(403).json({ explicit: true });
    return;
  }
  const updates = { name, description, price, onhand, img: img.name, category };
  try {
    const response = await Product.findOneAndUpdate(
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
