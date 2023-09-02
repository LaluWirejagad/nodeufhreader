const express = require('express');
const app = express();
const net = require('net');
const reader =  new net.Socket();

const webport = 3000;
const READER_PORT = 6000; // this is default port of the reader
const READER_IP = "192.168.1.190"; // the default IP

const ANSWER_MODE = Buffer.from([0x0a, 0x00, 0x35, 0x00, 0x02, 0x01, 0x00, 0x01, 0x00, 0x2a, 0x9f], 'hex');
const ACTIVE_MODE = Buffer.from([0x0a, 0x00, 0x35, 0x01, 0x02, 0x01, 0x00, 0x01, 0x00, 0x01, 0x9b], 'hex');
const INVENTORY = Buffer.from([0x04, 0x00, 0x01, 0xdb, 0x4b], 'hex');

let tempResult = {};

reader.connect(READER_PORT, READER_IP, () => {})
reader.on('connect', () => {
  interval = setInterval(() => {
    reader.write(INVENTORY);
    tempResult = {data: ""};
    reader.on('data', data => {
          const buf = Buffer.from(data, 'binary');
          const response = buf.toString('hex', 0, buf.length);
          tempResult = {data: response};
        });
    
  },500);
});

app.get('/',function(req, res){
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type','application/json');
  res.send(tempResult);
 });
  

app.listen(webport, () => {
  console.log(`Express server is running on port ${webport}`);
});