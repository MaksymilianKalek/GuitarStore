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

module.exports = router;