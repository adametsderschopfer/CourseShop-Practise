module.exports = (req, res, next) => {
  res.status(404).render("404", {
    title: "404 not found page!",
  });
};
