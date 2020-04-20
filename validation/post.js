const Validator = require("validator"); // takes only string as argument
const isEmpty = require("./is_empty");

module.exports = function validatePostInput(data) {
    let errors = {};

    data.text = !isEmpty(data.text) ? data.text : "";

    if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
        errors.text = "Post must be between 10 to 300 characters long";
    }

    if (Validator.isEmpty(data.text)) {
        errors.text = "Text field is required";
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};
