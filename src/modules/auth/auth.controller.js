const userModel = require("../../models/user")
const { errorResponse, successResponse } = require("../../utils/responses");
const { registerValidationSchema } = require("./auth.validator")

exports.register = async (req, res) => {
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
            return errorResponse(res, 400, "Email And username already Exist")
        }

        const isFirstUser = (await userModel.countDocuments()) === 0;
        let role = "USER"

        if (isFirstUser) {
            role: "ADMIN"
        }

        const registerUser = new userModel({
            email,
            password,
            username,
            name
        })

        registerUser = await registerUser.save()


        return successResponse(res, 200, {
            message: "User Created Successfully :))",
            user: { ...registerUser, password: undefined }
        })
    } catch (err) {
        next(err)
    }
}