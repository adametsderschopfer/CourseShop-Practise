const express = require("express");
const path = require("path");
const csrf = require("csurf");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const helmet = require('helmet');
const compression = require('compression')
const session = require("express-session");
const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const MongoStore = require("connect-mongodb-session")(session);
const { MONGODB_URI, SECRET_KEY } = require("./keys");

const varMiddleware = require("./middleware/variables");
const err404 = require("./middleware/error");
const userMiddleware = require("./middleware/user");
const fileMiddleware = require("./middleware/file");
const {
  homeRoutes,
  addRoutes,
  coursesRoutes,
  cartRoutes,
  ordersRoutes,
  authRoutes,
  profileRoutes,
} = require("./routes");

const app = express();
const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  handlebars: allowInsecurePrototypeAccess(Handlebars),
});

const store = new MongoStore({
  collection: "sessions",
  uri: MONGODB_URI,
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, "images")));

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store,
  })
);
app.use(fileMiddleware.single('avatar'));

app.use(csrf());
app.use(flash());
app.use(helmet());
app.use(compression());

app.use(varMiddleware);
app.use(userMiddleware);

app.use("/", homeRoutes);
app.use("/add", addRoutes);
app.use("/courses", coursesRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", ordersRoutes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

// 404
app.use(err404);

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    app.listen(PORT, () => {
      console.log(`Server has been started (Port: ${PORT}) ...`);
    });
  } catch (e) {
    console.error(`Server Error: ${error}`);
    process.exit(1);
  }
})();
