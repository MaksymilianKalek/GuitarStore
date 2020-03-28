const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const fs = require("fs");

//User model
const User = require("../models/User");

//Login page
router.get("/login", (req, res) => res.render("login"));

//Register page
router.get("/register", (req, res) => res.render("register"));

//Register Handler
router.post("/register", (req, res) => {
	const {
		name,
		email,
		password,
		password2
	} = req.body;
	let errors = [];

	//Checking
	if (!name || !email || !password || !password2) {
		errors.push({
			msg: "Please fill in all the fields"
		});
	}

	if (password !== password2) {
		errors.push({
			msg: "Passwords do not match "
		});
	}

	if (password.length < 4) {
		errors.push({
			msg: "Password should be at least 4 characters"
		});

	}

	if (errors.length > 0) {
		res.render("register", {
			errors,
			name,
			email,
			password,
			password2
		});
	} else {
		//Validation passed
		User.findOne({
				email: email
			})
			.then(user => {
				if (user) {
					//User exists
					errors.push({
						msg: "Email is already registered"
					});
					res.render("register", {
						errors,
						name,
						email,
						password,
						password2
					});
				} else {
					const newUser = new User({
						name,
						email,
						password
					});

					//Hash
					bcrypt.genSalt(10, (err, salt) =>
						bcrypt.hash(newUser.password, salt, (err, hash) => {
							if (err) throw err;

							//Set password to hashed
							newUser.password = hash;

							newUser.save()
								.then(user => {
									req.flash("success_msg", "You are now registered and you can log in");
									res.redirect("/users/login");
								})
								.catch(err => console.log(err));
						}));
				}
			});
	}
});

//Login handler
router.post("/login", (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/main",
		failureRedirect: "/users/login",
		failureFlash: true
	})(req, res, next);
});

//Logout handler
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success_msg", "You are logged out");
	res.redirect("/users/login");
});


//Contact handler
router.post("/sendContact", (req, res) => {
	const {
		name,
		email,
		message
	} = req.body;

	fs.writeFile(`./messages/messageFrom${name}.txt`, `Sender: ${name}\nEmail: ${email}\nMessage: ${message}`, (err) => {
		if (err) throw err;
		console.log("File created");
	});

	req.flash("success_msg", "Your message has been sent");
	res.redirect("/contact");
});

module.exports = router;