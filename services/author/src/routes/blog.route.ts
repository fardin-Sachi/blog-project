import express, { Router } from 'express';
import { isAuth } from '../middleware/auth.middleware.js';
import { createBlog, deleteBlog, updateBlog } from '../controller/blog.controller.js';
import uploadFile from '../middleware/multer.middleware.js';

const router:Router = express.Router();

router.post(
  "/",
  isAuth,
  uploadFile,
  createBlog
);

router.patch(
  "/:id",
  isAuth,
  uploadFile,
  updateBlog
);

router.delete(
  "/:id",
  isAuth,
  deleteBlog
)


export default router;