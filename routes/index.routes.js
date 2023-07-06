const express = require("express");
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/dummyCourses", (req, res, next) => {
  res.render("dummyCourses");
});

router.get("/meet-teachers", (req, res, next) => {
  res.render("meet-teachers");
});

router.get("/curriculum", (req, res, next) => {
  res.render("curriculum");
});

router.get("/deletevideo", (req, res, next) => {
  res.render("deletevideo");
});

module.exports = router;
