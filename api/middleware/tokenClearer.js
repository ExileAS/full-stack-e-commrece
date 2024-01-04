const clearTokens = (req, res, next) => {
  const validOrigin = req.headers?.referer.startsWith(
    process.env.CLIENT_URI_PROD
  );
  if (!validOrigin) {
    console.log("INVALID ORIGIN!!!");
    res.status(403).json({ err: "invalid origin" });
    return;
  }
  res.cookie("jwt", "", {
    maxAge: 1,
    secure: true,
    httpOnly: true,
    sameSite: "None",
  });
  res.cookie("jwtReset", "", {
    maxAge: 1,
    secure: true,
    httpOnly: true,
    sameSite: "None",
  });
  res.cookie("jwtSeller", "", {
    maxAge: 1,
    secure: true,
    httpOnly: true,
    sameSite: "None",
  });
  next();
};

module.exports = { clearTokens };
