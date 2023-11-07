const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRoutes");
const { checkUser, requireAuth } = require("./middleware/authMiddleware");
const productRouter = require("./routes/productsRoutes");
const cors = require("cors");
require("dotenv").config();
const paymentRouter = require("./routes/paymentRoutes");
const sellersRouter = require("./routes/sellerRoutes");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
  credentials: true,
};

app.use(morgan("tiny"));
app.use("/images", express.static("images"));
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(fileUpload());

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    const PORT = process.env.PORT || 3007;
    app.listen(PORT);
    console.log(`listening on port ${PORT}`);
  })
  .catch((err) => console.log(err));

app.use(express.urlencoded({ extended: true }));

app.get("/api/requireAuth", requireAuth);
app.get("/api/auth", checkUser);

app.use(productRouter);
app.use(sellersRouter);
app.use(authRouter);
app.use(paymentRouter);
