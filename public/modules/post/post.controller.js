const { createPostValidator } = require("./post.valicators");
const PostModel = require("./../../models/Post");

exports.showPostUploadView = async (req, res) => {
  return res.render("post/upload");
};

exports.createPost = async (req, res, next) => {
  try {
    const { description, hashtags } = req.body;
    const user = req.user;

    const tags = hashtags.split(",");

    if (!req.file) {
      req.flash("error", "Media is required !!");
      return res.render("post/upload");
    }

    await createPostValidator.validate({ description }, { abortEarly: false });
    const mediaUrlPath = `images/posts/${req.file.filename}`;

    // Create new post
    const post = new PostModel({
      media: {
        filename: req.file.filename,
        path: mediaUrlPath,
      },
      description,
      hashtags: tags,
      user: user._id,
    });

    await post.save();

    req.flash("success", "Post created successfully :))");
    return res.render("post/upload");
  } catch (err) {
    next(err);
  }
};
