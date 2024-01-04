const jwt = require("jsonwebtoken");
require("dotenv").config();
const csrf = require("csurf");
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  },
});

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;
  const validOrigin = verifyOrigin(req, res);
  if (!validOrigin) return;
  const checkingUserToken = req.route.path === "/api/checkToken";

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
      if (err) {
        res.status(400).json({ err: "invalid token" });
      } else if (checkingUserToken) {
        res.status(201).json({ valid: true });
      } else {
        next();
      }
    });
  } else {
    res.status(400).json({ err: "token expired!" });
  }
};

const requireAuth = (req, res, next) => {
  const tempToken = req.cookies.jwtTemp;
  const validOrigin = verifyOrigin(req, res);
  if (!validOrigin) return;
  if (tempToken) {
    jwt.verify(tempToken, process.env.TEMP_KEY, async (err, decodedToken) => {
      if (err) {
        res.status(400).json({ err: "invalid token" });
      } else {
        next();
      }
    });
  } else {
    res.status(400).json({ err: "no token" });
  }
};

const requireResetToken = (req, res, next) => {
  const resetToken = req.cookies.jwtReset;
  const validOrigin = verifyOrigin(req, res);
  if (!validOrigin) return;
  if (resetToken) {
    jwt.verify(resetToken, process.env.RESET_KEY, async (err, decodedToken) => {
      if (err) {
        res.status(400).json({ err: "invalid token" });
      } else {
        next();
      }
    });
  } else {
    res.status(400).json({ err: "no reset token" });
  }
};

const requireSellerToken = (req, res, next) => {
  const token = req.cookies.jwtSeller;
  const validOrigin = verifyOrigin(req, res);
  if (!validOrigin) return;
  if (token) {
    jwt.verify(token, process.env.SELLER_KEY, async (err, decodedToken) => {
      if (err) {
        res.status(400).json({ err: "invalid seller token" });
      } else {
        req.body.isSeller = true;
        next();
      }
    });
  } else {
    res.status(400).json({ err: "no seller token" });
  }
};

const verifyOrigin = (req, res) => {
  const validOrigin = req.headers?.referer?.startsWith(
    process.env.CLIENT_URI_PROD
  );
  if (!validOrigin) {
    res.status(403).json({ err: "invalid origin" });
  }
  return validOrigin;
};

const verifyOriginMiddleware = (req, res, next) => {
  const validOrigin = verifyOrigin(req, res);
  if (validOrigin) next();
};

module.exports = {
  checkUser,
  requireAuth,
  requireResetToken,
  csrfProtection,
  requireSellerToken,
  verifyOriginMiddleware,
};
