const express = require("express");
const app = express();
const helmet = require("helmet");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cron = require("node-cron");
require("dotenv").config();
const authRouter = require("./routes/authRoutes");
const productRouter = require("./routes/productsRoutes");
const userRouter = require("./routes/userRegisterRoutes");
const orderedProductsRouter = require("./routes/orderedProductsRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const paymentRouter = require("./routes/paymentRoutes");
const sellersRouter = require("./routes/sellerRoutes");
const sellerRegisterRouter = require("./routes/sellerRegisterRoutes");
const { checkUser, csrfProtection } = require("./middleware/authMiddleware");
const {
  cleanupExpiredUsers,
  cleanExit,
  cleanAccountResets,
  cleanupExpiredSellers,
} = require("./utils/cleanup");
const morgan = require("morgan");

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", `${process.env.CLIENT_URI_PROD}`],
    },
  })
);

app.use(
  helmet.hsts({
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  })
);

const corsOptions = {
  origin: process.env.CLIENT_URI_PROD,
  methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
  credentials: true,
};

app.use(morgan("tiny"));
app.set("trust proxy", 1);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/images", express.static("images"));
app.use(fileUpload());

mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    const PORT = process.env.PORT || 443;
    const server = app.listen(PORT);
    console.log(`listening on port ${PORT}`);
    cron.schedule("0 0 */2 * *", cleanupExpiredUsers);
    cron.schedule("0 0 */3 * *", cleanupExpiredSellers);
    cron.schedule("0 */12 * * *", cleanAccountResets);
    process.on("SIGINT", () => cleanExit(server));
  })
  .catch((err) => console.log(err));

app.options("/api/csrf-create-token", cors(corsOptions));
app.get("/api/csrf-create-token", csrfProtection, (req, res) => {
  const csrfToken = req.csrfToken();
  res.json({ csrfToken });
});
app.get("/api/checkToken", checkUser);
app.use(productRouter);
app.use(orderedProductsRouter);
app.use(userRouter);
app.use(sellerRegisterRouter);
app.use(sellersRouter);
app.use(reviewRouter);
app.use(authRouter);
app.use(paymentRouter);
