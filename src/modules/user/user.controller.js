const { register } = require("module");
const UserModel = require("../../models/User")


exports.showPageEditView = async (req, res) => {

    const user = await UserModel.findOne({_id: req.user._id})

    return res.render("user/edit.ejs", {
        user
    });
}



exports.updateProfile = async (req, res, next) => {
    try{
        const userID = req.user._id
        const {name, username, email} = req.body

        let updateData = {name , username, email}

        if (req.file){
            const {filename} = req.file
            const profilePath = `images/profile/${filename}`
            updateData.profilePicture = profilePath
        }
        
        const newUser = await UserModel.findOneAndUpdate(
            {_id: userID},
            updateData,
            {new: true}
        )


        req.flash("success", "profile picture updated successfully")
        return  res.redirect('/users/edit-profile');

    } catch (err) {
        next(err)
    }
}