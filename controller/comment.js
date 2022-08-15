const PostModel = require('../models/post');
const CommentModel = require('../models/comment');

module.exports.createComment = async (req, res) => {
  const { id } = req.params;
  const postData = await PostModel.findById(id);
  const commentData = new CommentModel(req.body.comment);
  commentData.author = req.user._id;
  postData.comments.push(commentData);
  await commentData.save();
  await postData.save();
  console.log(commentData);
  req.flash('success', 'Created comment!');
  res.redirect(`/post/${postData._id}`);
};

module.exports.deleteComment = async (req, res) => {
  const { id, commentId } = req.params;
  await PostModel.findByIdAndUpdate(id, { $pull: { comments: commentId } });
  await CommentModel.findByIdAndDelete(commentId);
  req.flash('success', 'Successfully deleted comment!');
  res.redirect(`/post/${id}`);
};