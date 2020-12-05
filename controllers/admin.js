/* eslint-disable no-unused-vars */
const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title,
    imageUrl,
    price,
    description,
    //we dont need to put user_id, moongose does it for us?
    userId: req.user,
  });

  product
    .save()
    .then((result) => {
      console.log("created product");
      res.redirect("/admin/products");
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  // Product.findByPk(prodId)
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
      });
    })
    .catch((err) => console.error(err));
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  Product.findById(prodId)
    .then((product) => {
      // ad a security check here
      // TODO: check if this conversion is still necessary, and even the underscore _id syntax?
      console.log(req.user.id);
      console.log(req.user._id);
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.imageUrl = updatedImageUrl;
      product.description = updatedDesc;
      // again an example were we have to nest the promise otherways we
      // would make it into this even though we return in the check above
      return product.save().then((result) => {
        console.log("updated");
        res.redirect("/admin/products");
      });
      // a catch will not be bubbled up
    })
    .catch((err) => console.error(err));
};

exports.getProducts = (req, res, next) => {
  //what does this method return if the user is not defined? => null
  //only show books of that user
  Product.find({ userId: req.user._id })
    // special mongoose methods for querying data
    .then((products) => {
      //console.log(products);
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // Product.findByIdAndRemove(prodId)
  // now other users cannot delete all books anymore
  Product.deleteOne({ _id: prodId, userId: req.user.id })
    .then(() => {
      //console.log("deleted");
      res.redirect("/admin/products");
    })
    .catch((err) => console.error(err));
};
