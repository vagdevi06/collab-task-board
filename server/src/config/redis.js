const Redis = require('ioredis');

const publisher = new Redis(process.env.REDIS_URL);
const subscriber = new Redis(process.env.REDIS_URL);

publisher.on('connect', () => console.log('Redis publisher connected'));
subscriber.on('connect', () => console.log('Redis subscriber connected'));

module.exports = { publisher, subscriber };