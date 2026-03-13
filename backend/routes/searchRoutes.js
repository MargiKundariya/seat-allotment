const express = require("express");
const router = express.Router();
const { searchByRank } = require("../controller/searchController");

router.post("/search", searchByRank);

module.exports = router;