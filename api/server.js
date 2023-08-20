const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRoutes");
const { checkUser, requireAuth } = require("./middleware/authMiddleware");
const productRouter = require("./routes/productsRoutes");

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

app.get("/api/requireAuth", requireAuth);
app.get("/api/auth", checkUser);

app.use(productRouter);
app.use(authRouter);
