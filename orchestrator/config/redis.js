const Redis = require('ioredis')

const redis = new Redis({

    password: process.env.REDIS_PASSWORD,
    host: 'redis-19467.c295.ap-southeast-1-1.ec2.cloud.redislabs.com',
    port: 19467

})

module.exports = redis