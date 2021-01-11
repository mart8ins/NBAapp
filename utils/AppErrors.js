/* class what extends Error object to create new customizable errors */

class AppErrors extends Error {
    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = AppErrors;

