'use strict';

const cardInfo = require('node-alsa-cardinfo');
const { execSync, spawn } = require('child_process');
const request = require('./sendRequest.js');
const path = require('path');

class AudioDeviceManager {
	constructor() {
		this.channel;
		this.index = {};
	}

	load({ deviceName, io }, callback) {
		const info = this.getInterface(deviceName, io);
		if ('channels' in info) {
			this.channel = info.channels.includes(2) ? 2 : (info.channels.includes(1) ? 1 : info.channels[0]);
			const deviceList = this.getDevices();
			deviceList.split('\n').forEach((device, index) => {
				if (device.includes('H3 Audio Codec')) this.index.main = index;
				if (device.includes('USB')) this.index.second = index;
				if (device.includes('equal,')) this.index.equal = index;
				if (device.includes('mic_sv')) this.index.usb = index;
			});
			// console.log({ channel: this.channel, index: this.index });
			// console.log(`${path.join(process.cwd(), 'services', 'usb-service', 'audioService.sh')} -i ${this.index['usb' in this.index ? 'usb' : 'second']} -o ${this.index['equal' in this.index ? 'equal' : 'main']} -c ${this.channel}`);
			if ('main' in this.index && 'second' in this.index) {
				this.startStream();
				callback(true, 'Run stream from USB input to output by default');
			} else {
				callback(false, 'Failed to read capture device');
			}
		} else {
			callback(false, 'Failed to read sound card ids');
		}
	}

	getInterface(device = 'hw:1,0', io = cardInfo.CAPTURE) {
		return cardInfo.get(device, io);
	}

	getDevices() {
		return execSync(`${path.join(process.cwd(), 'services', 'usb-service', 'audioService.sh')} -l`).toString();
	}

	startStream() {
		const stream = spawn(path.join(process.cwd(), 'services', 'usb-service', 'audioService.sh'), [`-i ${this.index['usb' in this.index ? 'usb' : 'second']} -o ${this.index['equal' in this.index ? 'equal' : 'main']} -c ${this.channel}`]);
		stream.stdout.on('data', (data) => {
			console.log(`stdout: ${data}`);
			request.sendStatus(true, 'stdout');
		});
		stream.stderr.on('data', (data) => {
			console.error(`stderr: ${data}`);
			request.sendStatus(true, 'stderr');
		});
		stream.on('close', (code) => {
			console.log(`audio ended with code: ${code}`);
			request.sendStatus(true, 'close');
		});
	}
}

module.exports.AudioDeviceManager = new AudioDeviceManager;
