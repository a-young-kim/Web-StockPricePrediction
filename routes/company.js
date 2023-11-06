const express = require("express");
const path = require("path");
const request = require('request');

const router = express.Router();

// GET
router.get('/', function(req, res){
    const filePath = path.join(__dirname, '../views/company.html');
    res.sendFile(filePath, err => {
        if (err) {
            res.status(500).send('Error sending the file.');
        }
    });
});

module.exports = router;