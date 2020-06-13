const { Router } = require("express");
const router = Router();
const Course = require("../models/course");
const isAuth = require("../middleware/auth");

router.get("/", isAuth, (req, res) => {
  res.render("add", {
    title: "Add a new course",
    isAdd: true,
  });
});

router.post("/", isAuth, async (req, res) => {
  const course = new Course({
    title: req.body.title,
    price: req.body.price,
    img: req.body.img,
    userId: req.user,
  });

  try {
    await course.save();
    res.redirect("/courses");
  } catch (e) {
    console.error(e);
  }
});

module.exports = router;
