const PostModel = require('./models/post');
const CommentModel = require('./models/comment');

module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/user/login')
    };
    next();
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const postData = await PostModel.findById(id);
    if (!postData.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission!');
        return res.redirect(`/post/${ id }`);
    }
    next();
};

module.exports.isCommentAuthor = async (req, res, next) => {
    const { id, commentId } = req.params;
    const CommentData = await CommentModel.findById(commentId);
    if (!CommentData.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission!');
        return res.redirect(`/post/${ id }`);
    }
    next();
};