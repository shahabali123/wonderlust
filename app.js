// require and config dotenv
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
};


// requiring packages
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodoverride = require('method-override');
const ExpressError = require("./utils/ExpressError.js");
const cookieParser =  require("cookie-parser");
const session =  require("express-session");
const MongoStore = require('connect-mongo');
const flash = require( "connect-flash" );
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const multer  = require('multer')
// const upload = multer({ dest: 'uploads/' })


// import routes
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");


const app = express();
const port = 8080;
//_________________________________________________________

// creating connection with database
const dbUrl = process.env.ATLASDB_URL;

async function main () {
    await mongoose.connect(dbUrl);  
}
main().then(console.log('connected to the database')).catch(e => console.error(e));
// ________________________________________________________
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended : true}));
app.set( "views", path.join(__dirname, "views" ));
app.use(methodoverride("_method"));
//__________________________________________________________


// mongo session store
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600, // ye 24 hours time hai session k end hony k liye
});

// mongo session store error handler
store.on("error", (err) => {
    console.log("Session Store Error: ", err);
});

// express sessions section
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
    };



app.use(session(sessionOptions));
app.use(flash());
//__________________________________________________________


// Passport section:
// ham chahty hain jb b koi request aye to ham passport ko initialize kr dain as a middleware to usky liye ham ye middleware likhain gy
app.use(passport.initialize());

app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//__________________________________________________________


// using locals
app.use((req, res, next)=>{
    res.locals.success  = req.flash("success");
    res.locals.error  = req.flash("error");
    res.locals.currUser = req.user;
    next();
})
//__________________________________________________________




// use routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// ______________________________________________________





app.listen(port, ()=>{
    console.log( `Server is running on ${port}`);
});





// handling unknown routes with express custom error message
app.all("*", (req, res, next)=>{
    next(new ExpressError(404, "Page not found"));
});


// error handling route
app.use((err, req, res, next) => {
    let {status=500, message= "Something went wrong"} = err;
    res.render("error.ejs", {err});
  });