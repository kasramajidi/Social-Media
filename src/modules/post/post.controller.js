const { createPostValidator } = require("./post.valicators");
const PostModel = require("./../../models/Post");
const hasAccessToPage = require("../../utils/hasAccessToPage")
const likeModel = require("../../models/Like")

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

exports.like = async (req, res, next) => {
  try {
    const user = req.user
    const { postID } = req.body

    const post = await PostModel.findOne({ _id: postID })
    if (!post) {
      //! error
    }

    const hasAccess = await hasAccessToPage(user._id, post.user.toString())

    if (!hasAccess) {
      //! error
    }

    const existingLike = await likeModel.findOne({
      user: user._id,
      post: postID
    })

    if (existingLike) {
      return res.redirect('back');
    }

    const like = new likeModel({
      post: postID,
      user: user._id,
    })

    like.save();

    return res.redirect("back")

  } catch (err) {
    next(err)
  }
}

exports.dislike = async (req, res, next) => {
  try {
    const user = req.user
    const { postID } = req.body

    const like = await likeModel.findOne({user: user._id, post: postID})

    if (!like){
      return res.redirect("back")
    }

    await likeModel.findOneAndDelete({user: user._id, post: postID})

    return res.redirect("back")
  } catch (err) {
    next(err)
  }
}