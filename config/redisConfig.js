const Redis = require("ioredis");

// Create a Redis client
const redis = new Redis({
  host: "redis-12943.c1.asia-northeast1-1.gce.redns.redis-cloud.com", // Redis server hostname (default is 'localhost')
  port: 12943, // Redis server port (default is 6379)
  password: "vVRsBHHPWJJ4djpCHxkeyBroOOyRqSRI", // Optional password (default is no password)
});

// Optional: Handle connection events
redis.on("connect", () => {
  console.log("Connected to Redis");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

module.exports = redis;
