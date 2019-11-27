//jshint esversion:9
require('dotenv').config();
const https = require('https');
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");
const mongoose = require("mongoose");
const MongoDBStore = require("connect-mongodb-session")(session);
const passportLocalMongoose = require("passport-local-mongoose");
const csurf = require("csrf");
const User = require('./models/user');
const Product = require("./models/product");
const Order = require("./models/order");
const connectDB = require("./config/db");
const indexRoutes = require('./routes/index');
const userRoutes = require('./routes/users');
const shopRoutes = require('./routes/shop');
const helmet = require("helmet");
const compression = require("compression");


const app = express();
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collections: 'sessions'
});

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

const csrfProtection = csurf();



app.use(session({
  secret: "some secret b.",
  resave: false,
  saveUninitialized: false,
  store: store
}));

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(csrfProtection, async (req, res, next) => {
  if (req.isAuthenticated()) {
    res.locals.isAuthenticated = true;
  }

  if (!req.isAuthenticated()) {
    res.locals.isAuthenticated = false;
  }

  res.locals.csrfToken = req.csrfToken();
  next();

});

app.use(passport.initialize());
app.use(passport.session());

//connect db
connectDB();

app.use(indexRoutes);
app.use(userRoutes);
app.use(shopRoutes);
app.use(helmet());
app.use(compression());



var port = process.env.PORT || 3000;

    var server = app.listen(port, function () {
        console.log('Server running at http://127.0.0.1:' + port + '/');
    });
