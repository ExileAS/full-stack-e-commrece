const { Router } = require("express");
const { get_all_sellers } = require("../controlers/sellerController");

const router = Router();

router.get("/api/allSellers", get_all_sellers);

module.exports = router;
