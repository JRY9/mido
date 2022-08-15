const mongoose = require('mongoose');
const { cloudinary } = require('../cloudinary');
const Schema = mongoose.Schema;
const CommentModel = require('./comment');

const ImageSchema = new Schema({
  url: String,
  filename: String
});

ImageSchema.virtual('thumbnail').get(function() {
  return this.url.replace('/upload', '/upload/w_200');
});

const PostSchema = new Schema({
  topic: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
    trim: true,
  },
  images: [ImageSchema],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'UserModel'
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'CommentModel'
    },
  ],
});

// Delete all comments when we delete post
PostSchema.post('findOneAndDelete', async (data) => {
  if (data) {
    await CommentModel.deleteMany({
      _id: {
        $in: data.comments
      }
    });
    for (let e of data.images) {
      await cloudinary.uploader.destroy(e.filename);    
    };
  };
});

module.exports = mongoose.model('PostModel', PostSchema);
