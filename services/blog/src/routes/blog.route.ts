import express, { Router } from "express";
import { getAllBlogs, getSingleBlog } from '../controller/blog.controller.js';

const router:Router = express.Router();

router.get(
  "/all",
  getAllBlogs,
);

router.get(
  "/:id",
  getSingleBlog,
)

export default router;