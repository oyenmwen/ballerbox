//jshint esversion:9
const express = require('express');
const accountController = require("../controllers/account");
const loginController = require("../controllers/login");
const registerController = require("../controllers/register");
const {
  check,
  validationResult
} = require('express-validator');
const router = express.Router();

router.get("/account", accountController.getUserAccount);
router.post("/login", loginController.postLogin);
router.get("/login", loginController.getLogin);
router.get("/reset", loginController.getReset);
router.post("/reset", loginController.postReset);
router.get("/reset/:token", loginController.getNewPassword);
router.post("/new-password", [
  check('username', 'Invalid email').isEmail(),
  check('password', 'The password must be longer than 5 characters and must contain a number')
  .not().isIn(['12345', 'password', 'qwert', 'letmein', 'qwerty']).withMessage('Sorry your password is much too common')
  .isLength({
    min: 5
  })
  .matches(/\d/)
], loginController.postNewPassword);
router.get("/logout", accountController.getLogout);
router.post("/register", [
  check('username', 'Invalid email').isEmail(),
  check('password', 'The password must be longer than 5 characters and must contain a number')
  .not().isIn(['12345', 'password', 'qwert', 'letmein', 'qwerty']).withMessage('Sorry your password is much too common')
  .isLength({
    min: 5
  })
  .matches(/\d/)
], registerController.postRegister);
router.get("/register", registerController.getRegister);
router.get("/user-orders", accountController.getOrders);

module.exports = router;
