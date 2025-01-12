const hasAccessToPage = require("../../utils/hasAccessToPage");
const FollowModel = require("./../../models/Follow");
const UserModel = require("../../models/User");
const postModel = require("../../models/Post")

exports.getPage = async (req, res, next) => {
  try {
    const user = req.user;
    const { pageID } = req.params;

    const hasAccess = await hasAccessToPage(user._id, pageID);

    const followed = await FollowModel.findOne({
      follower: user._id,
      following: pageID,
    });

    const page = await UserModel.findOne(
      { _id: pageID },
      "name username biography isVerified profilePicture"
    ).lean();

    if (!hasAccess) {
      req.flash("error", "Follow page to show content");
      return res.render("page/index", {
        followed: Boolean(followed),
        pageID,
        followers: [],
        followings: [],
        hasAccess: false,
        page,
        posts
      });
    }

    let followers = await FollowModel.find({
      following: pageID
    }).populate("follower", "name username")

    followers = followers.map((item) => item.follower)

    let followings = await FollowModel.find({
      follower: pageID
    }).populate("following", "name username")

    followings = followings.map((item) => item.following)

    const posts = await postModel.find({ user: pageID }).sort({_id: -1}).populate("user", "name username profilePicture")

    const own = user._id.toString() === pageID

    return res.render("page/index", {
      followed: Boolean(followed),
      pageID,
      followers,
      followings,
      hasAccess: true,
      page,
      posts,
      own
    });
  } catch (err) {
    next(err);
  }
};

exports.follow = async (req, res, next) => {
  try {
    const user = req.user;
    const { pageID } = req.params

    const targetOnePage = await UserModel.findOne({ _id: pageID })

    if (!targetOnePage) {
      req.flash("error", "page not found to follow");
      return res.redirect(`/pages/${pageID}`);;
    }

    if (user._id.toString() === pageID) {
      req.flash("error", "you cannot follow your page");
      return res.redirect(`/pages/${pageID}`);;
    }

    const existingFollow = await FollowModel.findOne({
      follower: user._id,
      following: pageID
    })

    if (existingFollow) {
      req.flash("error", "page already followed");
      return res.redirect(`/pages/${pageID}`);;
    }

    await FollowModel.create({
      follower: user._id,
      following: pageID
    })

    req.flash("success", "page followed successfully");
    return res.redirect(`/pages/${pageID}`);;
  } catch (err) {
    next(err);
  }
};

exports.unFollow = async (req, res, next) => {
  try {
    const user = req.user
    const { pageID } = req.params

    const unFollowPage = await FollowModel.findOneAndDelete({
      follower: user._id,
      following: pageID
    })

    if (!unFollowPage) {
      req.flash("error", "you didn't follow this page");
      return res.redirect(`/pages/${pageID}`);;
    }

    req.flash("success", "page unFollowed successfully");
    return res.redirect(`/pages/${pageID}`);;
  } catch (err) {
    next(err);
  }
};
