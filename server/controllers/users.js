const User = require("../model/users");
const bcrypt = require("bcrypt");

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const hashpassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashpassword,
    });
    return res.json({ status: true, user });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.json({ msg: "User Not Found", status: false });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.json({ msg: "Password is Invalid", status: false });
    }
    delete user.password;
    return res.json({ status: true, user });
  } catch (error) {
    next(error);
  }
};

exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
    });
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const user = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(user);
  } catch (error) {
    next(error);
  }
};
