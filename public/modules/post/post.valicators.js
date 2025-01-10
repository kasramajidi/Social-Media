const yup = require("yup");

exports.createPostValidator = yup.object({
  description: yup
    .string()
    .max(2200, "Description cannot be more than 2200 chars long !!"),
});
