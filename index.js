// express
const express = require("express");
const app = express();
const session = require("express-session");

// utilities
const AppErrors = require("./utils/AppErrors");
const flash = require("connect-flash");

// express/app setup
const path = require("path");
const ejsMate = require("ejs-mate");
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine("ejs", ejsMate);
app.use(flash());
app.use(session({ secret: "badsecret" }));


// mongo db
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/nbaStats", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})
const db = mongoose.connection;
db.on("error", console.error.bind("error occured: "));
db.once("open", () => {
    console.log("Connection to database successful!");
});

// flash msg middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.userLoggedIn = req.session.user_id;
    next();
})




// routers
const teamRouter = require("./router/team");
const gameRouter = require("./router/game");
const userRouter = require("./router/user");

app.use("/", userRouter);
app.use("/teams", teamRouter);
app.use("/games", gameRouter);


// home routes routes
app.get("/", (req, res) => {
    res.render("index")
})

app.all("*", (req, res, next) => {
    next(new AppErrors(404, "Page not found"));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something went wrong";
    res.status(statusCode).render("error", { err })
})

app.listen(3000, () => {
    console.log("App started on port 3000")
})