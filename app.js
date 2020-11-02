const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const hostname = "127.0.0.1";
const port = 3000;

const db = require("./util/database");

const errorController = require("./controllers/error");

const app = express();

// config templating engine
app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const Product = require("./models/product");
const User = require("./models/user");

//config boy parser
app.use(bodyParser.urlencoded({ extended: false }));
// make the static folder for assets available
app.use(express.static(path.join(__dirname, "public")));

// make user available. remember, app use just registers the function, so it will be available
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      // and here we are storing the user object, with sequelize methods etc.
      req.user = user;
      // and here we have to call next
      next();
    })
    .catch((err) => {
      console.error(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// define relationships
Product.belongsTo(User, { constraints: true, onDelete: "cascade" });
// and the inverse (optional). this can be importand depending on the associationmethods you wand to
// have available
User.hasMany(Product);

// this will initialize and create a db table with the defined models if it does not exist.
// force true is for development only, it overwirtes existing tables! { force: true }
db.sync()
  .then((result) => {
    // create dummy user
    return User.findByPk(1);
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Sevi", email: "test@test.com" });
    }
    // since both cases have to be handled correctly so I can get the result in the next then.
    // return Pormise.resolve(user);
    // but since ist is wrapped in a then block, it will automatically return a promise.
    return user;
  })
  .then((user) => {
    //console.log(user);
    listen();
  })
  .catch((err) => {
    console.log(err);
  });

function listen() {
  app.listen(port, hostname, () => {
    console.log(`Server listening on http://${hostname}:${port}`);
  });
}
