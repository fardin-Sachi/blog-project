import express, { Router } from 'express';
import { loginUser } from '../controller/user.controller.js';
const router = express.Router();
router.post("/login", loginUser);
export default router;
//# sourceMappingURL=user.route.js.map