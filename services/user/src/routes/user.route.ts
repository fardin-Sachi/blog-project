import express, { Router } from 'express';
import { getUserProfile, loginUser, myProfile, updateUser } from '../controller/user.controller.js';
import { isAuth } from '../middleware/auth.middleware.js';

const router: Router = express.Router();

router.post(
  "/login", 
  loginUser
);

router.get(
  "/me",
  isAuth,
  myProfile
);

router.get(
  "/user/:id",
  getUserProfile,
);

router.patch(
  "/update",
  isAuth,
  updateUser
)

export default router;