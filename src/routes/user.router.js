import express from 'express';
import { getUserInfo, getSavedImages, getCreatedImages, saveImage, updateUserInfo, updateProfilePicture, changePassword } from '../controllers/user.controller.js';
import { middlewareTokenHandler } from '../config/jwt.js';
import { upload } from '../config/upload.js';

const userRouter = express.Router();

userRouter.get('/info', middlewareTokenHandler, getUserInfo);
userRouter.get('/saved-images', middlewareTokenHandler, getSavedImages);
userRouter.get('/created-images', middlewareTokenHandler, getCreatedImages);
userRouter.post('/save-image', middlewareTokenHandler, saveImage);
userRouter.put('/update-info', updateUserInfo);
userRouter.put('/update-profile-picture', upload.single('anh_dai_dien'), updateProfilePicture);
userRouter.put('/change-password', middlewareTokenHandler, changePassword);

export default userRouter;
