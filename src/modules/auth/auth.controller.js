const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodeMailer = require("nodemailer")
const { errorResponse, successResponse } = require("../../utils/responses");
const UserModel = require("./../../models/User");
const RefreshTokenModel = require("./../../models/RefreshToken");
const ResetPasswordModel = require("../../models/ResetPassword")
const {
  registerValidationSchema,
  loginValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema
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


exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body

    const userID = await RefreshTokenModel.verifyToken(refreshToken)

    if (!userID) {
      //! Error code
    }

    await RefreshTokenModel.findOneAndDelete({ token: refreshToken })

    const user = await RefreshTokenModel.findOne({ _id: userID })

    if (!user) {
      //! Error code
    }

    const accessToken = jwt.sign({ userID: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30day"
    })

    const newRefreshToken = await RefreshTokenModel.createToken(user)

    res.cookie("access-token", accessToken, {
      maxAge: 900_000,
      httpOnly: true
    });

    res.cookie("refresh-token", newRefreshToken, {
      maxAge: 900_000,
      httpOnly: true
    });

  } catch (err) {
    next(err)
  }
}

exports.showForgetPasswordView = async (req, res, next) => {
  return res.render("auth/forget-password")
}

exports.showResetPasswordView = async (req, res, next) => {
  return res.render("auth/reset-password")
}

exports.forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    await forgetPasswordValidationSchema.validate(
      { email },
      { abortEarly: true }
    );

    const user = await UserModel.findOne({ email });
    if (!user) {
      //! Error
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const resetTokenExpireTime = Date.now() + 1000 * 60 * 60;

    const resetPassword = new ResetPasswordModel({
      user: user._id,
      token: resetToken,
      tokenExpireTime: resetTokenExpireTime,
    });

    resetPassword.save();

    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: "ce01010101it@gmail.com",
        pass: "uyar ralp koas xhxa",
      },
    });

    const mailOptions = {
      from: "ce01010101it@gmail.com",
      to: email,
      subject: "Reset Password Link For Your Social account",
      html: `
       <h2>Hi, ${user.name}</h2>
       <a href=http://localhost:${process.env.PORT}/auth/reset-password/${resetToken}>Reset Password</a>
      `,
    };

    transporter.sendMail(mailOptions);

    req.flash("success", "Password reset email sent");
    return res.redirect("back");

  } catch (err) {
    next(err)
  }
}


exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    await resetPasswordValidationSchema.validate(
      { token, password },
      { abortEarly: true }
    );

    const resetPassword = await ResetPasswordModel.findOne({
      token,
      tokenExpireTime: { $gt: Date.now() },
    });

    if (!resetPassword) {
      req.flash("error", "Invalid or expired token !!");
      return res.redirect("back");
    }

    const user = await UserModel.findOne({ _id: resetPassword.user });

    if (!user) {
      //! Error
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.findOneAndUpdate(
      { _id: user._id },
      {
        password: hashedPassword,
      }
    );

    await ResetPasswordModel.findOneAndDelete({ _id: resetPassword._id });

    req.flash("error", "Password reset successfully");
    return res.redirect("/auth/login");
  } catch (err) {
    next(err)
  }
}