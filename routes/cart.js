const { Router } = require("express");
const router = Router();
const Course = require("../models/course");
const isAuth = require("../middleware/auth");

function mapCourses(cart) {
  return cart.items.map((c) => ({
    ...c.courseId._doc,
    id: c.courseId.id,
    count: c.count,
  }));
}

function computePrice(courses) {
  return courses.reduce((total, c) => {
    return (total += c.price * c.count);
  }, 0);
}

router.post("/add", isAuth, async (req, res) => {
  const course = await Course.findById(req.body.id);
  await req.user.addToCart(course);

  return res.redirect("/cart");
});

router.delete("/remove/:id", isAuth, async (req, res) => {
  await req.user.removeFromCart(req.params.id);
  const user = await req.user.populate("cart.items.courseId").execPopulate();

  const courses = mapCourses(user.cart);

  const cart = {
    courses,
    price: computePrice(courses),
  };

  res.status(200).json(cart);
});

router.get("/", isAuth, async (req, res) => {
  const user = await req.user.populate("cart.items.courseId").execPopulate();

  const courses = mapCourses(user.cart);

  res.render("cart", {
    title: "Cart page",
    isCart: true,
    courses: courses,
    price: computePrice(courses),
  });
});

module.exports = router;
