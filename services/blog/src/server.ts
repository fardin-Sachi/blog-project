import express from 'express';
import ENV from './config/env.config.js';
import blogRouter from './routes/blog.route.js';

const app = express();


app.use(express.json());

const PORT = ENV.PORT;

app.use("/api/v1/blogs", blogRouter);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
})