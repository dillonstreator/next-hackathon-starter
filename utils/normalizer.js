const validator = require("validator");

module.exports = {
    normalizeEmail: email => validator.normalizeEmail(email)
}