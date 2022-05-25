// Librerias
const express = require('express');
const http = require('http');
const app = express(); 
const router = express.Router();
const sqlite3 = require('sqlite3').verbose(); 
const path = require('path'); 
const mqtt = require('mqtt');
const { json } = require('express/lib/response');

var server = http.Server(app); 
var io = require("socket.io")(server); 

// Recursos 
app.use(express.static(__dirname+'/'));

// Configuracion del servidor 

app.set("view engine", "ejs"); 
app.set("views", path.join(__dirname,"")); 
app.use(express.urlencoded({extended:false})); 
app.listen(3000); 
console.log("Servidor corriendo en el puerto 3000"); 

//Base de datos 

const db_name = path.join(__dirname,"db", "base,db"); 
const db = new sqlite3.Database(db_name, err =>{
    if (err) {
        console.error(err.message);
    } else {
        console.log("Conexion exitosa con la base de datos"); 
    }
})

//Base de datos - tablas 

const sql_crete = "CREATE TABLE IF NOT EXISTS Device (Producto_ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, Nombre VARCHAR(100) NOT NULL, Panel REAL NOT NULL, Corriente REAL NOT NULL, Potencia REAL NOT NULL, Bateria REAL NOT NULL, FOTORESITENCIA REAL NOT NULL)";

db.run(sql_crete, err => { 
    if (err) {
        console.error(err.message);
    } else {
        console.log("Se creo la tabla"); 
    }
});

// MQTT conexion con TTN

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


    //console.log("Data from TTN: ", getDataFromTTN.end_device_ids.device_id);
    var nombre = getDataFromTTN.end_device_ids.device_id;
    var panel = getDataFromTTN.uplink_message.decoded_payload.analog_in_1;
    var corriente = getDataFromTTN.uplink_message.decoded_payload.analog_in_2;
    var potencia = getDataFromTTN.uplink_message.decoded_payload.analog_in_3;
    var bateria = getDataFromTTN.uplink_message.decoded_payload.analog_in_4;
    var foto = getDataFromTTN.uplink_message.decoded_payload.digital_in_5;

    console.log(getDataFromTTN);

    console.log(nombre);
    console.log(panel);
    console.log(corriente);
    console.log(potencia);
    console.log(bateria);
    console.log(foto);

    const sql = "INSERT INTO Device(Nombre,Panel,Corriente,Potencia,Bateria,FOTORESITENCIA)VALUES (?, ?, ?, ?, ?, ?)"
    const new_insert = [nombre,panel,corriente,potencia,bateria,foto];

    //const err = "NO SE INSERTARON LOS DATOS"

    /*db.run(sql, new_insert, (err)=>{
        if(err){
            console.log('ERROR', err);
        } else{SS
            console.log('Insercion de datos correcta ');
        }
    })*/
});

// Enrutamiento 

app.get('/', (req,res) =>{
    res.render('index.ejs')
});

app.get('/alarmas', (req,res) =>{
    res.render('alarmas.ejs')
});

app.get('/logs', (req,res) =>{ //log lo que hace consultar lo que hay en la base de datos y mostrarlo por pantalla
    const sql = "SELECT * FROM Device ORDER BY Producto_ID"
    db.all(sql,[],(err,rows)=>{
        if(err){
            return console.error(err.message)
        } else{
            res.render('log.ejs',{modelo:rows})
        }
    })
});

app.get('/dashboard', (req,res) =>{

    res.render('dashboard.ejs')
   /* const sql = "SELECT * FROM Device ORDER BY Producto_ID"

    db.all(sql,[],(err,rows)=>{
        if(err){
            return console.error(err.message)
        } 

        res.render('dashboard.ejs',json({
                "message":"success",
                "data":rows
            }))
        })*/

});
    

