const express = require("express");
const mysql = require("../../mysql/index.js");
const router = express.Router();

router.post("/save", async(req, res) => {
    const users = await mysql.query("saveArticle", req.body);

    res.send(JSON.stringify(users));
});

router.post("/saveClass", async(req, res) => {
    const users = await mysql.query("saveClass", [req.body.class, req.body.date, req.body.company]);

    res.send(JSON.stringify(users));
});

router.post("/getTopThree", async(req, res) => {
    const users = await mysql.query("getTopThree");
    res.json(users);
});

router.post("/getAllTable", async(req, res) => {
    const users = await mysql.query("getAllTable");
    res.json(users);
});

router.post("/getCompanyTable", async(req, res) => {
    const users = await mysql.query("getCompanyTable", [req.body.company]);
    res.json(users);
});

module.exports = router;