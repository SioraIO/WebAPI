'use strict';

const { Client } = require('pg');
const config = require('../config');
const consString = `tcp://${config.DB_USER}:${config.DB_PASSWORD}@${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}` ;
const client = new Client(consString);

module.exports = function(io) {
      client
      .connect()
      .then(() => console.log("connected"))
      .catch(e => console.log("connection error", e.stack));
      
      //listen event
      client.query('LISTEN events');
      client.on('notification', msg => {
            let payload = JSON.parse(msg.payload);
            io.emit(payload.from_acc_addr, payload);
            io.emit(payload.to_acc_addr, payload);
      });
}