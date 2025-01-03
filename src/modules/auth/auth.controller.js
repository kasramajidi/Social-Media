const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { errorResponse, successResponse } = require("../../utils/responses");
const UserModel = require("./../../models/User");
const RefreshTokenModel = require("./../../models/RefreshToken");
const {
  registerValidationSchema,
  loginValidationSchema,
} = require("./auth.validator");

exports.showRegisterView = async (req, res) => {
  return res.render("auth/register");
};

exports.register = async (req, res, next) => {
  try {
    const { email, username, name, password } = req.body;

    await registerValidationSchema.validate(
      {
        email,
        username,
        name,
        password,
      },
      {
        abortEarly: false,
      }
    );

    const isExistUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });

    if (isExistUser) {
      req.flash("error", "Email or username already exist");

      return res.redirect("/auth/register");
      // return errorResponse(res, 400, "Email or username already exist !!");
    }

    const isFirstUser = (await UserModel.countDocuments()) === 0;
    let role = "USER";
    if (isFirstUser) {
      role = "ADMIN";
    }

    let user = new UserModel({ email, username, password, name });
    user = await user.save();

    const accessToken = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30day",
    });

    const refreshToken = await RefreshTokenModel.createToken(user);

    res.cookie("access-token", accessToken, {
      maxAge: 900_000,
      httpOnly: true,
    });
    res.cookie("refresh-token", refreshToken, {
      maxAge: 900_000,
      httpOnly: true,
    });

    req.flash("success", "Signed up was successfully");

    return res.redirect("/auth/register");

    // return successResponse(res, 201, {
    //   message: "User created successfully :))",
    //   user: { ...user.toObject(), password: undefined },
    //   accessToken
    // });
  } catch (err) {
    next(err);
  }
};

exports.showLoginView = async (req, res) => {
  return res.render("auth/login");
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    await loginValidationSchema.validate(
      {
        email,
        password,
      },
      {
        abortEarly: false,
      }
    );

    const user = await UserModel.findOne({ email }).lean();

    if (!user) {
      req.flash("error", "User not found !!");
      return res.redirect("/auth/login");
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      req.flash("error", "Invalid Email Or Password !!");
      return res.redirect("/auth/login");
    }

    const accessToken = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30day",
    });

    const refreshToken = await RefreshTokenModel.createToken(user);

    res.cookie("access-token", accessToken, {
      maxAge: 900_000,
      httpOnly: true,
    });

    res.cookie("refresh-token", refreshToken, {
      maxAge: 900_000,
      httpOnly: true,
    });

    req.flash("success", "Signed In was successfully");

    return res.redirect("/auth/login");
  } catch (err) {
    next(err);
  }
};
