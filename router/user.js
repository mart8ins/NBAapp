const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");


/* *********
REGISTER
*********** */
router.get("/register", (req, res) => {
    res.render("user/register")
})

router.post("/register", catchAsync(async (req, res) => {
    const { username, password, email } = req.body;

    // to check if username or email already exists
    const alreadyExistsUsername = await User.findOne({ username });
    const alreadyExistsUserEmail = await User.findOne({ email });
    if (alreadyExistsUsername) {
        req.flash("error", `Username "${username}" is already taken!`);
        return res.redirect("/register")
    }
    if (alreadyExistsUserEmail) {
        req.flash("error", `Email "${email}" is already in use!`);
        return res.redirect("/register")
    }

    const newUser = await new User({ username, password, email });

    // store in session new/created users id - so after registering hes already logged in
    req.session.user_id = newUser._id;
    await newUser.save();
    res.redirect("/");
}));


/**********
LOGIN
**********/

router.get("/login", (req, res) => {
    res.render("user/login")
})

router.post("/login", catchAsync(async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findAndValidate(username, password);
    if (foundUser) {
        req.session.user_id = foundUser._id; // stores user id in express session, can use it after to allow or block user acces to routes
        req.flash("success", "Login successful!");
        return res.redirect("/")
    } else {
        req.flash("error", "Username or password is incorrect!");
        return res.redirect("/login");
    }
}))


/**********
LOGOUT
**********/
router.post("/logout", (req, res) => {
    // req.session.user_id = null;
    req.session.destroy();
    res.redirect("/");
});



module.exports = router;