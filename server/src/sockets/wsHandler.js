const { subscriber } = require('../config/redis');
const jwt = require('jsonwebtoken');
const url = require('url');

const boardRooms = new Map();

const wsHandler = (wss) => {
  wss.on('connection', (ws, req) => {
    const { query } = url.parse(req.url, true);
    const { token, boardId } = query;

    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      ws.close(1008, 'Unauthorized');
      return;
    }

    if (!boardRooms.has(boardId)) boardRooms.set(boardId, new Set());
    boardRooms.get(boardId).add(ws);
    console.log(`Client joined board: ${boardId}`);

    subscriber.subscribe(`board:${boardId}`);

    ws.on('close', () => {
      boardRooms.get(boardId)?.delete(ws);
    });
  });

  subscriber.on('message', (channel, message) => {
    const boardId = channel.replace('board:', '');
    const clients = boardRooms.get(boardId);
    if (!clients) return;
    clients.forEach((client) => {
      if (client.readyState === 1) client.send(message);
    });
  });
};

module.exports = wsHandler;