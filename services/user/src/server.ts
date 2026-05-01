import express from 'express';
import connectDb from './config/db.config.js';
import userRoutes from './routes/user.route.js';
import ENV from './config/env.config.js';
import cloudinary from './config/cloudinary.config.js';
import cors from 'cors';

const PORT = ENV.PORT;

const app = express();

app.use(express.json());
app.use(cors());

connectDb();
cloudinary();

// Visualize Request Body
// app.use((req, res, next) => {
//   console.log("Incoming request");
//   console.log("Headers:", req.headers);
//   console.log("Body:", req.body);
//   next();
// });

app.use("/api/v1/users", userRoutes);



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});