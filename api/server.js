const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Product = require("./models/productModel");
const OrderedProducts = require("./models/oderedProductsModel");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRoutes");
const { checkUser } = require("./middleware/authMiddleware");

app.use(express.json());
app.use(cookieParser());

const dbURI =
  "mongodb+srv://ahmed-samy:shadow333@cluster0.vsmcsg8.mongodb.net/";
mongoose
  .connect(dbURI)
  .then((result) => {
    app.listen(3007);
    console.log("listening on port 3007");
  })
  .catch((err) => console.log(err));

app.use(express.urlencoded({ extended: true }));

app.get("/api/auth", checkUser);

app.get("/api/all-products", (req, res) => {
  try {
    Product.find()
      .sort({ createdAt: -1 })
      .then((result) => res.status(200).json({ result }))
      .catch((err) => console.log(err));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api", (req, res) => {
  const product = new Product(req.body);
  product.save();
});

app.post("/api/post-ordered", (req, res) => {
  const productsOrdered = new OrderedProducts(req.body);
  productsOrdered.save();
});

app.use(authRouter);
