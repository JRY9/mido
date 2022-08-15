const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { isLoggedin, isCommentAuthor } = require('../middleware');
const commentController = require('../controller/comment');

router.post('/', isLoggedin, catchAsync(commentController.createComment));
  
router.delete('/:commentId', isLoggedin, isCommentAuthor, catchAsync(commentController.deleteComment));

module.exports = router;