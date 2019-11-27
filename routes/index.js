//jshint esversion:9
const express = require("express");
const router = express.Router();
const session = require("express-session");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const passport = require("passport");
const mongoose = require("mongoose");
const csurf = require("csurf");
const csrfProtection = csurf();

//GET Home page
router.get('/', (req,res,next) => {
  if(req.isAuthenticated()){
    res.render("home", {
      loggedin: true,
      errors: [],
      login: false,
      modal:false

    });
  }
  else{
  res.render("home", {
    loggedin: false,
    errors: [],
    login: false,
    modal:false

  });
}
});

router.get('/how-it-works', (req,res,next) => {
  res.render("how-it-works", {
    loggedin: req.isAuthenticated(),
    errors:[],
    modal: false,
    login:false
  });
});

router.get('/products', (req,res,next) => {
  res.render("products", {
    loggedin: req.isAuthenticated(),
    errors:[],
    modal: false,
    login:false
  });
});


module.exports = router;
