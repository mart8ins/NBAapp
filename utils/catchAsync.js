/* function for catching errors in async function */

module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
};

