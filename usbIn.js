#!/bin/node

const cardInfo = require('node-alsa-cardinfo');
const { execSync, spawn } = require('child_process');
const path = require('path');

const info = cardInfo.get('hw:1,0', 1);
if ('channels' in info) {
	let data = { index: {} };
	data.channel = info.channels.includes(2) ? 2 : (info.channels.includes(1) ? 1 : info.channels[0]);
	const deviceList = execSync(`${path.join(process.cwd(), 'audioService.sh')} -l`).toString();
	console.log(deviceList);
	deviceList.split('\n').forEach((device, index) => {
		if (device.includes('H3 Audio Codec')) data.index.main = index;
		if (device.includes('USB')) data.index.second = index;
		if (device.includes('equal,')) data.index.equal = index;
		if (device.includes('mic_sv')) data.index.usb = index;
	});
	console.log(data);
	console.log(`${path.join(process.cwd(), 'audioService.sh')} -i ${data.index['usb' in data.index ? 'usb' : 'second']} -o ${data.index['equal' in data.index ? 'equal' : 'main']} -c ${data.channel}`);
	const audio = spawn(path.join(process.cwd(), 'audioService.sh'), [`-i ${data.index['usb' in data.index ? 'usb' : 'second']} -o ${data.index['equal' in data.index ? 'equal' : 'main']} -c ${data.channel}`]);
	audio.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);
	});
	audio.stderr.on('data', (data) => {
		console.error(`stderr: ${data}`);
	});
	audio.on('close', (code) => {
		console.log(
			`audio завершился с кодом ${code}`
		);
	});
} else {
	console.log(info);
}
