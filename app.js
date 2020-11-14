const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const hostname = "127.0.0.1";
const port = 3000; // I don't get why it does not recognize the import without .monogoconnect

/* postgres */
//const db = require("./util/database");

/* mongo */ const mongoConnect = require("./util/mongo").mongoConnect;

const errorController = require("./controllers/error");

const app = express();

// config templating engine
app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

/* postgres */
/* const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item"); */

const User = require("./models/user");

// config boy parser
app.use(bodyParser.urlencoded({ extended: false }));
// make the static folder for assets available
app.use(express.static(path.join(__dirname, "public")));

// make user available. remember, app use just registers the function, so it will be available mongo
app.use((req, res, next) => {
  /* postgres */
  /*   User.findByPk(1)
    .then((user) => {
      // and here we are storing the user object, with sequelize methods etc.
      req.user = user;
      // and here we have to call next
      next();
    })
    .catch((err) => {
      console.error(err);
    }); */

  User.findById("5faf14bdcdf52203f1ef14d6")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

/* postgres */
/* // define relationships one user, many products
Product.belongsTo(User, { constraints: true, onDelete: "cascade" });
// and the inverse (optional). this can be importand depending on the associationmethods you wand to
// have available
User.hasMany(Product);

// Cart relationships
User.hasOne(Cart);
Cart.belongsTo(User);
// the many to many
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });

// this will initialize and create a db table with the defined models if it does not exist.
// force true is for development only, it overwirtes existing tables! { force: true }
db
  //sync({ force: true })
  .sync()
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
    // create a default cart
    return user.createCart({});
  })
  .then(() => {
    listen();
  })
  .catch((err) => {
    console.log(err);
  }); */

/* mongo */
// passing a callback to mongoConnect
mongoConnect(() => {
  listen();
});

function listen() {
  app.listen(port, hostname, () => {
    console.log(`Server listening on http://${hostname}:${port}`);
  });
}
