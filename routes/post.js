const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedin, isAuthor } = require('../middleware');
const postController = require('../controller/post');

const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(postController.index))
    .post(isLoggedin, upload.array('image', 5), catchAsync(postController.createPost))

router.get('/new', isLoggedin, catchAsync(postController.renderNewForm));

router.route('/:id')
    .get(catchAsync(postController.showPost))
    .put(isLoggedin, isAuthor, upload.array('image', 5), catchAsync(postController.updatePost))
    .delete(isLoggedin, isAuthor, catchAsync(postController.deletePost))

router.get('/:id/edit', isLoggedin, isAuthor, catchAsync(postController.renderEditForm));

module.exports = router;