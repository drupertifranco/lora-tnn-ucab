var express = require("express");
var app = express();
app.use(express.static("public")); //Procedure to set public folder contain process files (css,image,.js,..)


const sqlite3 = require('sqlite3').verbose;
const path = require('path');

// Recursos 
app.use(express.static(__dirname+'/'));

// Parse URL-encoded bodies (as sent by HTML forms)
app.set('view engine', 'ejs'); // Use ejs instead of html
app.set("views", path.join(__dirname, "")); // view folder contain .ejs files
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: true}))

// creacion del servidor
var server = require("http").Server(app); 
var io = require("socket.io")(server); 
server.listen(process.env.PORT || 3000, () => { 
   console.log('listening on *:3000');// servidor escuchando en el puerto 3000
});

// MQTT conexion con TTN
var mqtt = require('mqtt');
var options = {
    port: 1883,
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'prueba-otaa@ttn',
    password: 'NNSXS.6AZSSS3RA6L3JOCESAACGR4OQ5MAHS6QPIOLRRI.RISBGYZMGS3LXTVRGSO5HS75EIHD3LPZN2A37WGCP6SLRHBNB5HQ',
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};
var client = mqtt.connect('https://nam1.cloud.thethings.network',options);

// Variables globales
var globalMQTT = 0;


// SOCKET
io.on("connection", function(socket)
{
  console.log("Client connected: " + socket.id);

  socket.on("disconnect", function() {
    console.log(socket.id + " disconnected");
  });

  socket.on("REQUEST_GET_DATA", function() {
    socket.emit("SEND_DATA",globalMQTT);
  });

  function intervalFunc() {
    socket.emit("SEND_DATA", globalMQTT);
  }
  setInterval(intervalFunc, 2000);
});


// MQTT configuracion
client.on('connect', function() {
    console.log('Client connected to TTN')
    client.subscribe('#')
});

client.on('error', function(err) {
    console.log(err);
});

client.on('message', function(topic, message) {
    var getDataFromTTN = JSON.parse(message);
    //console.log("Data from TTN: ", getDataFromTTN.uplink_message.rx_metadata.snr);
    console.log("Data from TTN: ", getDataFromTTN.end_device_ids.device_id);


    //console.log("Data from TTN: ", getDataFromTTN.uplink_message.decoded_payload.analog_in_1);
    //console.log("Data from TTN: ", getDataFromTTN.uplink_message.decoded_payload.analog_in_2);
    //console.log("Data from TTN: ", getDataFromTTN.rx_metadata.snr);
    //var getFrmPayload = getDataFromTTN.uplink_message;
    //globalMQTT = Buffer.from(getFrmPayload, 'base64').toString();
});

// Base de datos 

const db_name = path.join(__dirname,"db", "base.db"); 
const db = new sqlite3.Database(db_name, err => {
  if(err){
    return console.error(err.message); 
  } else {
    console.log("Conexion exitosa con la DB");
  }
}); 


// Setup load ejs file to display on Browsers
//app.get('/lora',function(req,res){
   //res.render("dashboard");
//});