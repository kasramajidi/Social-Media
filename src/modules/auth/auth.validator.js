const yup = require("yup")

exports.registerValidationSchema = yup.object({
    email: yup
        .string()
        .email("please inter a valid email")
        .required("email is required"),
    username: yup
        .string()
        .min(3, "username must at last 3 chars long")
        .max(15, "username cannot be at more than 15 chars long")

        .required("username is required"),
    name: yup
        .string()
        .min(3, "name must at last 3 chars long")
        .max(15, "name cannot be at more than 15 chars long")
        .required("name is required"),
    password: yup
        .string()
        .min(3, "password must at last 3 chars long")
        .max(15, "password cannot be at more than 15 chars long")
        .required("password is required"),
})

exports.loginValidationSchema = yup.object({
    email: yup
    .string()
    .email("please inter a valid email")
    .required("email is required"),
    
    password: yup
    .string()
    .min(3, "password must at last 3 chars long")
    .max(15, "password cannot be at more than 15 chars long")
    .required("password is required"),
})