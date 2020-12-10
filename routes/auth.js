const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

const { check, body } = require("express-validator/check");

const User = require("../models/user");

router.get("/login", authController.getLogin);

router.post("/login", authController.postLogin);

router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("please sevi")
      .custom((value, { req }) => {
        // if (value !== "sevi@sevi.com") {
        //   throw new Error("Whant other email");
        // }
        // return true;
        User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("email already taken");
          }
        });
      }),
    body("password", "default error message for all validators")
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  ],
  authController.postSignup
);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
