import express from 'express'
import {
  uploadImage,
  getAllImages,
  getImageByName,
  getImageById,
  getCommentsByImageId,
  checkImageSaved,
  deleteImage,
  tagImage,
  getImageTags
} from '../controllers/image.controller.js';
import { upload } from '../config/upload.js';
import { middlewareTokenHandler } from '../config/jwt.js';

const imageRouter = express.Router();

// Upload image
imageRouter.post("/upload-image", middlewareTokenHandler, upload.single('image'), uploadImage);

// Get all images
imageRouter.get("", getAllImages);

// Get image by name
imageRouter.get("/search-name", getImageByName);

// Get image by ID
imageRouter.get("/image-detail/:hinh_id", getImageById);

// Get comments for an image
imageRouter.get("/comments/:hinh_id", getCommentsByImageId);

// Check if an image is saved by the user
imageRouter.get("/check-saved/:hinh_id", middlewareTokenHandler, checkImageSaved);

// Delete an image
imageRouter.delete("/:hinh_id", middlewareTokenHandler, deleteImage);

// Tag an image
imageRouter.post("/tag/:hinh_id", middlewareTokenHandler, tagImage);

// Get tags for an image
imageRouter.get("/tag/:hinh_id", getImageTags);

export default imageRouter;
