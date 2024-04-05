const User = require("../models/user.js"); // Require the User model here






// get req for signup form
module.exports.getSignUpForm = (req,res)=>{
    res.render("./users/signup.ejs");
};

// post req for signup user
module.exports.signUpUser = async(req, res) =>{
    try {
        let {username, email, password} = req.body;
    const newUser = new User({ username ,email});
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Account created successfully! Welcome to Wonderlust!");
        res.redirect("/listings")
    });
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/signup");
    }
    
};

// get login route
module.exports.getLogin = (req,res)=>{
    res.render("./users/login.ejs");
};

// post login
module.exports.postLogin = 
"local", 
{failureRedirect: '/login', failureFlash: true}, 
async(req,res)=>{
    req.flash("success","Welcome back!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// logout route
module.exports.logOut = (req, res, next)=>{
    req.logOut((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success", "Logged out successfully!")
        res.redirect('/listings');
    }); // this will remove the user from session
};