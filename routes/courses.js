const { Router } = require("express");
const Course = require("../models/course");
const router = Router();
const isAuth = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("userId", "email name")
      .select("price title img");

    res.render("courses", {
      title: "All courses",
      isCourses: true,
      courses: courses,
    });
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.render("course", {
      layout: "empty",
      title: `Курс ${course.title}`,
      course,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id/edit", isAuth, async (req, res) => {
  try {
    if (!req.query.allow) {
      return res.redirect("/");
    }
    const course = await Course.findById(req.params.id);

    res.render("course-edit", {
      title: `Редактировать ${course.title}`,
      course,
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/remove", isAuth, async (req, res) => {
  try {
    await Course.deleteOne({ _id: req.body.id });
    res.redirect("/courses");
  } catch (e) {
    console.error(e);
  }
});

router.post("/edit", isAuth, async (req, res) => {
  try {
    const { id } = req.body;
    delete req.body.id;

    await Course.findByIdAndUpdate(id, req.body);
    res.redirect("/courses");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
