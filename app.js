if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
} 

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); 
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


//requiring listing and review routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


 const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//express session
const sessionOptions = {
  secret:  process.env.SECRET,
  resave: false, 
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//flash route
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser=req.user;
  next();
});

//using listing and review routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);


// error middleware
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!!"));
}); 

//hanfler m.w.
app.use((err, req, res, next) => {
    let {statusCode=500, message="something went wrong"} = err;
   // res.status(statusCode).send(message);
   res.render("error.ejs",{message})
}); 

//listening route
app.listen(8080, () => {
  console.log("server is listening to port 8080");
});