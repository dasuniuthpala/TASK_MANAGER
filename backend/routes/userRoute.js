import express from 'express';
import { getCurretUser, loginUser, registerUser, Updatepassword, updateProfile } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js'


const userRouter = express.Router();

//public links

userRouter.post('/register',registerUser);
userRouter.post('/login',loginUser);


//private links protect also
userRouter.get('/me', authMiddleware, getCurretUser);
userRouter.put('/profile', authMiddleware, updateProfile);
userRouter.put('/password', authMiddleware, Updatepassword);

export default userRouter;