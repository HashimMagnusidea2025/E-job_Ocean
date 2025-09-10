import express from 'express';
import { VerifyOtp,PostComment, RequestOtp ,GetCommentsByBlog} from './comment.controller.js';

import {protect} from '../../middleware/auth.Middleware.js';
const CommentRuter = express.Router();


CommentRuter.post('/request-otp',RequestOtp);

CommentRuter.post('/verify-otp', VerifyOtp);

CommentRuter.post('/post',protect,PostComment);

CommentRuter.get('/:id',GetCommentsByBlog);

export default CommentRuter;