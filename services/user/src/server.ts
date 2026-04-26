import express from 'express';
import dotenv from 'dotenv';
import connectDb from './utils/db.js';
import userRoutes from './routes/user.route.js';

dotenv.config();

const PORT = process.env.PORT|| 3000;


const app = express();

app.use(express.json());

connectDb();

app.use("/api/v1/user", userRoutes);



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});