/* eslint-disable no-unused-vars */
const path = require("path");

const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");

const express = require("express");
const bodyParser = require("body-parser");
const hostname = "127.0.0.1";
const port = process.env.PORT || 3000;
const errorController = require("./controllers/error");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const User = require("./models/user");
const flash = require("connect-flash");

const app = express();

// for session storing
const store = new MongoDBStore({
  uri: `${process.env.MONGO_CONNECTION}`,
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

// init cross site forgery tokens
const csrfProtection = csrf();

// config templating engine
app.set("view engine", "ejs");
app.set("views", "views");

app.use(
  session({
    secret: "longstringpw",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// make user available. remember, app uses just registers the function, so it will be available mongo
// this only works, because we work on that particular request and pass it on.
// After a request is hadled and a response is set, the context of the request is lost.
app.use((req, res, next) => {
  // check if session user is present
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      // create user for this request based on the session data
      // because we need the functions on the mongoose user model.
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

// config body parser
app.use(bodyParser.urlencoded({ extended: true }));

// make the static folder for assets available
app.use(express.static(path.join(__dirname, "public")));

//after session and body parser, this is very important!
app.use(csrfProtection);

app.use(flash());

// set variables to for each request with this local thing
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// this filters the request
app.use("/admin", adminRoutes);
// this does not filter the request
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

mongoose
  .connect(`${process.env.MONGO_CONNECTION}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "shop",
  })
  .then((result) => {
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
