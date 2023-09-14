const express = require("express");
const mysql = require("../../mysql/index.js");
const router = express.Router();

router.post("/save", async(req, res) => {
    const users = await mysql.query("saveArticle", req.body);

    res.send(JSON.stringify(users));
});

module.exports = router;