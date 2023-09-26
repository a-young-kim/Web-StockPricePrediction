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
        if(err) res.status(500).json({ error: '서버에서 오류가 발생했습니다.' });
        else {
            console.log(body);

            const data = {
                title: body.title,
                company: body.company,
                date:body.date,
            };

            // article
            const API_article = {
                url: req.headers.origin + '/api/article/save',
                method: 'POST',
                json: data,
            };
            request.post(API_article, function(err, httpResponse, body){
                res.json(data);
            });
        }
    });
});

router.post('/model', function(req, res){
    // flask로 전송
    const flaskServer = 'http://localhost:5000/kobert';
    const options = {
        url: flaskServer,
        method: 'POST',
        json: {
            title: req.body.title,
            company: req.body.company,
            date: req.body.date, 
        },
        headers: {
            "Content-Type": "application/json",
        },
    };
    
    request.post(options, function(err, httpResponse, body){
        if(err) res.status(500).json({ error: '서버에서 오류가 발생했습니다.' });
        else {
            console.log(body);

            const data = {
                class: body.class,
                company: body.company,
                date:body.date,
            };

            // class
            const API_article = {
                url: req.headers.origin + '/api/article/saveClass',
                method: 'POST',
                json: data,
            };
            request.post(API_article, function(err, httpResponse, body){
                res.json(data);
            });
        }
    });
});

module.exports = router;
