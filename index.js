#!/bin/node

const express = require('express');
const bodyParser = require('body-parser');
const manager = require('./audioDeviceManager.js').AudioDeviceManager;
const port = process.argv.slice(2)[0];
const app = express();
const request = require('./sendRequest.js');

app.use(bodyParser.json());

app.post('/load', (req, res) => {
    const deviceData = req.body.deviceData; 
    manager.load(typeof deviceData == 'object' ? deviceData : {}, (result, msg) => {
        res.status(result ? 202 : 400).send(result ? `Stream callback => ${result}` : { problem: msg });
    });
});

app.post('/pid', (req, res) => {
    res.status(202).send({ pid: process.pid });
});

console.log(`Threats service listening on port ${port}`);
app.listen(port);

request.send('ready', { pid: process.pid }, (err, response, body) => {
    console.log({ err: err, /*response: response, body: body*/ });
});

