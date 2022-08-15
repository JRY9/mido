const UserModel = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
  res.render('users/register');
};

module.exports.register = async (req, res, next) => {
  try {
    console.log(req.file);
    const { username, email, password } = req.body;
    const newUser = new UserModel({ username, email });

    newUser.profilePicture.url = req.file.path;
    newUser.profilePicture.filename = req.file.filename;
    console.log(newUser);
    newUser.save();

    const registeredUser = await UserModel.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash('success', 'Welcome to Mido by JRY');
      res.redirect('/post');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/user/register');
  }
};

module.exports.renderLogin = (req, res) => {
  res.render('users/login');
};

module.exports.login = (req, res) => {
  req.flash('success', 'Welcome');
  res.redirect('/post');
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Goodbye!');
    res.redirect('/post');
  });
};
