const hasAccessToPage = require("../../utils/hasAccessToPage");
const FollowModel = require("./../../models/Follow");
const UserModel = require("../../models/User");
const { use } = require("./page.routes");

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
      followed: Boolean(followed),
      pageID,
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

    if (!targetOnePage){
      req.flash("error", "page not found to follow");
      return  res.redirect(`/pages/${pageID}`);;
    }

    if (user._id.toString() === pageID){
      req.flash("error", "you cannot follow your page");
      return  res.redirect(`/pages/${pageID}`);;
    }

    const existingFollow = await FollowModel.findOne({
      follower: user._id,
      following: pageID
    })

    if (existingFollow){
      req.flash("error", "page already followed");
      return  res.redirect(`/pages/${pageID}`);;
    }

    await FollowModel.create({
      follower: user._id,
      following: pageID
    })

    req.flash("success", "page followed successfully");
    return  res.redirect(`/pages/${pageID}`);;
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
