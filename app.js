const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const hostname = "127.0.0.1";
const port = 3000; // I don't get why it does not recognize the import without .monogoconnect

/* mongo */ const mongoConnect = require("./util/mongo").mongoConnect;

const errorController = require("./controllers/error");

const app = express();

// config templating engine
app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const User = require("./models/user");

// config boy parser
app.use(bodyParser.urlencoded({ extended: false }));
// make the static folder for assets available
app.use(express.static(path.join(__dirname, "public")));

// make user available. remember, app use just registers the function, so it will be available mongo
app.use((req, res, next) => {
  User.findById("5faf14bdcdf52203f1ef14d6")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// passing a callback to mongoConnect
mongoConnect(() => {
  listen();
});

function listen() {
  app.listen(port, hostname, () => {
    console.log(`Server listening on http://${hostname}:${port}`);
  });
}
