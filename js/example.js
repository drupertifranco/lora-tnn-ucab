'use strict';

var ttn = require('ttn');

//const { base64encode, base64decode } = require('nodejs-base64');

var appEUI = 'prueba-otaa@ttn';
var accessKey = 'NNSXS.WXWNA6YQIS3FOMTMOHF5Z2BAFCEUUFOQB5BHSJY.XCBJPMJWN5VT3DWMA6UMMYKX5JN434NNHSGM6UVJIJWPJM2NAGPA';

var client = new ttn.Client('nam1.cloud.thethings.network', appEUI, accessKey);


client.on('connect', function () {
	console.log('[DEBUG]', 'Connected');
});

client.on('error', function (err) {
	console.error('[ERROR]', err.message);
});

client.on('activation', function (e) {
	console.log('[INFO] ', 'Activated: ', e.devEUI);
});

client.on('uplink', function (msg) {
	console.info('[INFO] ', 'Uplink: ' + JSON.stringify(msg, null, 2));
});

client.on('uplink_1', function (msg) {
	console.info(msg);
	console.info('#########################################################################');
	//console.info('[HUMEDAD]: ',msg.payload.uplink_message. decoded_payload.relative_humidity_2);  
	//console.info('[TEMPERATURA]: ',msg.payload.uplink_message. decoded_payload.temperature_1);
	//console.info('[TIME]: ',msg.payload.received_at);
	//var utcDate = msg.payload.received_at;  // ISO-8601 formatted date returned from server
	//var localDate = new Date(utcDate);   
	//var date = convertUTCDateToLocalDate(new Date(utcDate));
	//console.info('[TIME]: ',localDate);
	//console.info('[TIME]: ',date.toLocaleDateString('en-US'));
	//console.info('[TIME]: ',date.toLocaleTimeStringsvsvs('en-US'));
	
	console.info('#########################################################################');
	//"relative_humidity_2"
	//"temperature_1"

	//console.info('[INFO] ', 'Uplink: ' + JSON.stringify(msg, null, 2));
	
	//var decoded = base64decode(msg.payload.uplink_message.frm_payload);
	//console.log(decoded.charCodeAt(0));
});

/*client.on('uplink_2', function (msg) {
	console.info(msg);
	console.info('#########################################################################');
	//console.info('[HUMEDAD]: ',msg.payload.uplink_message. decoded_payload.relative_humidity_2);  
	//console.info('[TEMPERATURA]: ',msg.payload.uplink_message. decoded_payload.temperature_1);
	//console.info('[TIME]: ',msg.payload.received_at);
	//var utcDate = msg.payload.received_at;  // ISO-8601 formatted date returned from server
	//var localDate = new Date(utcDate);   
	//var date = convertUTCDateToLocalDate(new Date(utcDate));
	//console.info('[TIME]: ',localDate);
	//console.info('[TIME]: ',date.toLocaleDateString('en-US'));
	//console.info('[TIME]: ',date.toLocaleTimeStringsvsvs('en-US'));
	
	console.info('#########################################################################');
	//"relative_humidity_2"
	//"temperature_1"

	//console.info('[INFO] ', 'Uplink: ' + JSON.stringify(msg, null, 2));
	
	//var decoded = base64decode(msg.payload.uplink_message.frm_payload);
	//console.log(decoded.charCodeAt(0));
});*/

client.on('uplink', function (msg) {

	// respond to every third message
	if (msg.counter % 3 === 0) {
		console.log('[DEBUG]', 'Downlink');

		var payload = new Buffer('4869', 'hex');
		client.downlink(msg.devEUI, payload);
	}
});