import express from "express";
import ENV from './config/env.config.js';
import { initDb } from './config/db.config.js';
import blogRouter from './routes/blog.route.js';
import cloudinaryConfig from './config/cloudinary.config.js';
import { connectRabbitMq } from './config/rabbitmq.config.js';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

connectRabbitMq();

const PORT = ENV.PORT;

app.use("/api/v1/blogs", blogRouter);

initDb().then(() => {
  cloudinaryConfig();
  
  app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
});
