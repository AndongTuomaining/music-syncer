const express = require('express')
const app = express()
const server = require('http').createServer(app);
const WebSocket = require('ws');

const wss = new WebSocket.Server({ server: server });

var connections = {};


const IsJsonString = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

const broadcast = (msg, a) => {
  wss.clients.forEach(client => {
    client.send(`{"data":${JSON.stringify(msg)}, a:${a}`);
  })
}

const cAllReady = () => {
  if (Object.keys(connections).length === 0) return;
  for (let n in connections) {
    if (!connections[n]) {
      return;
    }
  }
  broadcast()
}

wss.on('connection', function connection(ws) {
  let id = Math.floor(100000 + Math.random() * 900000);
  connections[id] = false;

  broadcast(connections)

  ws.on('message', function incoming(message) {
    if (!IsJsonString(message.toString())) return;
    let msg = JSON.parse(message.toString());
    if (msg.ready != null) {
      if (msg.ready) {
        connections[id] = true;
        cAllReady()
      } else {
        connections[id] = false;
      }
      broadcast(connections)
    }
  });
  ws.on("close", () => {
    delete connections[id];
    broadcast(connections)
    cAllReady()
  })
});

server.listen(3000, () => console.log(`Lisening on port :3000`))