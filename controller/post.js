const PostModel = require('../models/post');
const { cloudinary } = require('../cloudinary/index');

module.exports.index = async (req, res) => {
  const postData = await PostModel.find({}).populate('author');
  res.render('post/index', { postData });
};

module.exports.renderNewForm = async (req, res) => {
  res.render('post/new');
};

module.exports.createPost = async (req, res, next) => {
  const postData = new PostModel(req.body.post);
  postData.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
  postData.author = req.user._id;
  await postData.save();
  console.log(postData);
  req.flash('success', 'Successfully made a new post!');
  res.redirect(`/post/${postData._id}`);
};

module.exports.showPost = async (req, res) => {
  const { id } = req.params;
  const postData = await PostModel.findById(id)
    .populate({
      path: 'comments',
      populate: {
        path: 'author',
      },
    })
    .populate('author');
  if (!postData) {
    req.flash('error', 'Cannot find that post');
    return res.redirect('/post');
  }
  console.log(postData);
  res.render('post/show', { postData });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const postData = await PostModel.findById(id);
  res.render('post/edit', { postData });
};

module.exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const postData = await PostModel.findByIdAndUpdate(id, { ...req.body.post });
  const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
  postData.images.push(...imgs);
  await postData.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    };
    await postData.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
  };
  console.log(postData);
  req.flash('success', 'Successfully updated post!');
  res.redirect(`/post/${postData._id}`);
};

module.exports.deletePost = async (req, res) => {
  const { id } = req.params;
  await PostModel.findByIdAndDelete(id);
  req.flash('success', 'Successfully deleted post!');
  res.redirect('/post');
};