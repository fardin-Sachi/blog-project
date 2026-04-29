import express, { Router } from "express";
import { getAllBlogs } from '../controller/blog.controller.js';

const router:Router = express.Router();

router.get(
  "/all",
  getAllBlogs
)

export default router;