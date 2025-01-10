const UserModel = require("./../models/User");
const FollowModel = require("./../models/Follow");

module.exports = async (userID, pageID) => {
  try {
    if (userID === pageID) return true;

    const page = await UserModel.findOne({ _id: pageID });
    if (!page.private) return true;

    const followed = await FollowModel.findOne({
      follower: userID,
      following: pageID,
    });
    if (!followed) return false;

    return true;
  } catch (err) {
    // Codes
  }
};
