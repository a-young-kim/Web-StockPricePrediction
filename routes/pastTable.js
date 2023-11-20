const express = require("express");
const path = require("path");
const request = require('request');

const router = express.Router();

// GET
router.get('/', function(req, res){
    const filePath = path.join(__dirname, '../views/pastTable.html');
    res.sendFile(filePath, err => {
        if (err) {
            res.status(500).send('Error sending the file.');
        }
    });
});

router.post('/getAllTable', function(req, res){
    const API_article = {
        url: req.headers.origin + '/api/article/getAllTable',
        method: 'POST',
    };
    
    request.post(API_article, function(err, httpResponse, body){
        res.json(JSON.parse(body));
    });
});

router.post('/getCompanyTable', function(req, res){
    const API_article = {
        url: req.headers.origin + '/api/article/getCompanyTable',
        method: 'POST',
        json: {company : req.body.company},
    };
    
    request.post(API_article, function(err, httpResponse, body){
        res.json(body);
    });
});

module.exports = router;