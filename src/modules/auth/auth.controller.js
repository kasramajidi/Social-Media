const userModel = require("../../models/user")
const refreshTokenModel = require("../../models/refreshToken")
const { errorResponse, successResponse } = require("../../utils/responses");
const { registerValidationSchema } = require("./auth.validator")
const jwt = require("jsonwebtoken")

exports.register = async (req, res, next) => {
    try {
        const { email, password, name, username } = req.body

        await registerValidationSchema.validate({
            email,
            password,
            name,
            username
        }, {
            abortEarly: false,
        })

        const isExistUser = await userModel.findOne({
            $or: [{ username }, { email }]
        })

        if (isExistUser) {
            req.flash("error", "Email And username already Exist")
            return res.redirect('/auth/register');
            // return errorResponse(res, 400, "Email And username already Exist")
        }

        const isFirstUser = (await userModel.countDocuments()) === 0;
        let role = "USER"

        if (isFirstUser) {
            role: "ADMIN"
        }

        let registerUser = new userModel({
            email,
            password,
            username,
            name
        })

        registerUser = await registerUser.save()

        const accessToken = jwt.sign({ userID: registerUser._id }, process.env.JWT_SECRET, {
            expiresIn: "30day"
        });

        const refreshToken = await refreshTokenModel.createToken(registerUser)

        res.cookie("access-token", accessToken, { maxAge: 900_00, httpOnly: true })
        res.cookie("refresh-token", refreshToken, { maxAge: 900_00, httpOnly: true })


        req.flash("success", "signed up was Successfully")

        return res.redirect("/auth/register")

        // return successResponse(res, 200, {
        //     message: "User Created Successfully :))",
        //     user: { ...registerUser.toObject(), password: undefined }
        // })
    } catch (err) {
        next(err)
    }
}

exports.showRegisterView = async (req, res) => {
    return res.render("auth/register")
}