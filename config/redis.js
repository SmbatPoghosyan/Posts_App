// install "ioredis" library before working with Redis
const Redis = require("ioredis");

// Create a Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST, // Redis server hostname (default is 'localhost')
  port: process.env.REDIS_PORT, // Redis server port (default is 6379)
  password: process.env.REDIS_PASSWORD, // Optional password (default is no password)
});

// Optional: Handle connection events
redis.on("error", (err) => {
  if (err) {
    console.error("Redis connection error:", err);
  } else {
    console.log("Connected to Redis");
  }
});

// Export redis
module.exports = redis;
