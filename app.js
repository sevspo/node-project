/* eslint-disable no-unused-vars */
const path = require("path");

const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const express = require("express");
const bodyParser = require("body-parser");
const hostname = "127.0.0.1";
const port = 3000; // I don't get why it does not recognize the import without .monogoconnec
const errorController = require("./controllers/error");

const app = express();
const store = new MongoDBStore({
  uri: "mongodb://root:mongo@mongo:27017",
  databaseName: "shop",
  collection: "mySessions",
  connectionOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  function(error) {
    console.error(error);
  },
});

// config templating engine
app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const User = require("./models/user");

app.use(
  session({
    secret: "longstringpw",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// config boy parser
app.use(bodyParser.urlencoded({ extended: false }));
// make the static folder for assets available
app.use(express.static(path.join(__dirname, "public")));

// make user available. remember, app use just registers the function, so it will be available mongo
// this only works, because we work on that particular request and pass it on.
// After a request is hadled and a response is set, the context of the request is lost.

// this filters the request
app.use("/admin", adminRoutes);
// this does not filter the request
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose
  .connect("mongodb://root:mongo@mongo:27017", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "shop",
  })
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {
        const user = new User({
          name: "Severin",
          email: "severin@gmail.com",
          cart: { items: [] },
        });
        user.save();
      }
    });
    //console.log(result);
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
