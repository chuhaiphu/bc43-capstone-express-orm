import express from 'express';
import { createComment } from '../controllers/comment.controller.js';
import { middlewareTokenHandler } from '../config/jwt.js';

const commentRouter = express.Router();

// Create a new comment
commentRouter.post("/", middlewareTokenHandler, createComment);

export default commentRouter;
