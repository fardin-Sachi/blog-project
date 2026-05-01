import express from 'express';
import ENV from './config/env.config.js';
import blogRouter from './routes/blog.route.js';
import { connectRedis } from './config/redis.config.js';
import { startCacheConsumer } from './utils/consumer.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = ENV.PORT;

// RabbitMQ connection
startCacheConsumer();

// Redis Connection
connectRedis()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch(console.error);
  
app.use("/api/v1/blogs", blogRouter);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})