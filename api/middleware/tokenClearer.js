const clearTokens = (req, res, next) => {
  const validOrigin = req.headers?.referer.startsWith(
    process.env.CLIENT_URI_PROD
  );
  if (!validOrigin) {
    res.status(403).json({ err: "invalid origin" });
    return;
  }
  res.cookie("jwt", "", { maxAge: 1 });
  res.cookie("jwtReset", "", { maxAge: 1 });
  res.cookie("jwtSeller", "", { maxAge: 1 });
  next();
};

module.exports = { clearTokens };
