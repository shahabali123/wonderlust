const express = require("express");
const router = express.Router(); 
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

// Route for "/signup"
router.route("/signup")
    .get(userController.getSignUpForm) // GET request for signup form
    .post(wrapAsync(userController.signUpUser)); // POST request for signup form

// Route for "/login"
router.route("/login")
    .get(userController.getLogin) // GET request for login
    .post(saveRedirectUrl, passport.authenticate(userController.postLogin)); // POST request for login

// Route for "/logout"
router.get("/logout", userController.logOut); // GET request for logout

module.exports = router;
