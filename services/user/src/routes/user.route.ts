import express, { Router } from 'express';
import { loginUser } from '../controller/user.controller.js';

const router: Router = express.Router();

router.post(
  "/login", 
  loginUser
);

export default router;