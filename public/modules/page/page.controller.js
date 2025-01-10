const hasAccessToPage = require("../../utils/hasAccessToPage");
const FollowModel = require("./../../models/Follow");

exports.getPage = async (req, res, next) => {
  try {
    const user = req.user;
    const { pageID } = req.params;
    const hasAccess = await hasAccessToPage(user._id, pageID);

    const followed = await FollowModel.findOne({
      follower: user._id,
      following: pageID,
    });

    if (!hasAccess) {
      req.flash("error", "Follow page to show content");
      return res.render("page/index", {
        followed: Boolean(followed),
        pageID,
      });
    }
    return res.render("page/index", {
      followed: Boolean(true),
      pageID,
    });
  } catch (err) {
    next(err);
  }
};

exports.follow = async (req, res, next) => {
  try {
    res.json({ message: "User Followed Successfully :))" });
  } catch (err) {
    next(err);
  }
};

exports.unFollow = async (req, res, next) => {
  try {
    res.json({ message: "User UnFollowed Successfully :))" });
  } catch (err) {
    next(err);
  }
};
