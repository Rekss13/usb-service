'use strict';

const request = require('@cypress/request');

const copyObject = serializable => JSON.parse(JSON.stringify(serializable, 'utf8'));

class sendRequest {
    constructor() { }

    _send(URL, body = copyObject({}), callback = () => { }) {
        const gateway = 'http://localhost:9032';
        request.post({
            headers: { 'content-type': 'application/json' },
            url: `${gateway}/${URL}`,
            body: JSON.stringify(body)
        }, (error, response, body) => callback(error, response, body));
    }

    send(URL, body = copyObject({}), callback) {
        this._send(`service/${URL}`, { ...body, service: "usb-service" }, callback);
    }

    sendStatus(status, state, callback) {
        this.send('setStatus', { status: status, state: state }, callback);
    }
}

module.exports = new sendRequest();