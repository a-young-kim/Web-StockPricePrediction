const express = require("express");
const path = require("path");
const request = require('request');

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
    const company = req.body.company;
    // flask로 전송
    const flaskServer = 'http://localhost:5000';
    const options = {
        url: flaskServer,
        method: 'POST',
        json: {
            company: company
        },
        headers: {
            "Content-Type": "application/json",
        },
    };
    
    request.post(options, function(err, httpResponse, body){
        if(err) console.log(err);
        else console.log(body);
    });
});

module.exports = router;
