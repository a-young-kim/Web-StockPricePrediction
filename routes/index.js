const express = require("express");
const path = require("path");

const router = express.Router();

// GET
router.get('/', function(req, res){
    const filePath = path.join(__dirname, '../views/index.html');
    res.sendFile(filePath, err => {
        if (err) {
            res.status(500).send('Error sending the file.');
        }
    });
});

// POST
router.post('/', function(req, res){
    const filePath = path.join(__dirname, '../views/index.html');
    res.sendFile(filePath, err => {
        if (err) {
            res.status(500).send('Error sending the file.');
        }
    });
});

module.exports = router;
