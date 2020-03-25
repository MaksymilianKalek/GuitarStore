const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../config/auth");

//Welcome Page
router.get("/", (req, res) => res.render("welcome"));
//Main Page
router.get("/main", ensureAuthenticated, (req, res) =>
res.render("main", {
  name: req.user.name
}));

router.get("/guitars", ensureAuthenticated, (req, res) =>
res.render("guitars", {
  name: req.user.name
}));

router.get("/amps", ensureAuthenticated, (req, res) =>
res.render("amps", {
  name: req.user.name
}));

router.get("/contact", ensureAuthenticated, (req, res) =>
res.render("contact", {
  name: req.user.name,
  email: req.user.email
}));

module.exports = router;