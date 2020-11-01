const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const hostname = "127.0.0.1";
const port = 3000;

const db = require("./util/database");

const errorController = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// this will initialize and create a db table with the defined models if it does not exist.
db.sync()
  .then((result) => {
    // console.log(result);
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
