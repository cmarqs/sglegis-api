const Validator = require('validator');
const { isEmpty } = require('../utils/functions');

const validateLogin = (data) => {
    let errors = {};
    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    
    if (Validator.isEmpty(data.email)) errors.email = "Email field is required.";
    if (Validator.isEmpty(data.password)) errors.password = "Password field is required.";

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

const validateReset = (data) => {
    let errors = {};
    data.email = !isEmpty(data.email) ? data.email : "";
    
    if (Validator.isEmpty(data.email)) errors.email = "Email field is required.";

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports = { validateLogin, validateReset };