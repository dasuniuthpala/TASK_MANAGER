import express from 'express';
import { getCurretUser, loginUser, registerUser, Updatepassword, updateProfile } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';
import rateLimiter from '../middleware/rateLimiter.js';

const userRouter = express.Router();

//public links with rate limiting
userRouter.post('/register', rateLimiter(3, 15 * 60 * 1000), registerUser);
userRouter.post('/login', rateLimiter(5, 15 * 60 * 1000), loginUser);

//private links protect also
userRouter.get('/me', authMiddleware, getCurretUser);
userRouter.put('/profile', authMiddleware, updateProfile);
userRouter.put('/password', authMiddleware, rateLimiter(3, 15 * 60 * 1000), Updatepassword);

export default userRouter;