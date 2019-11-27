//jshint esversion:9
const express = require('express');
const mongoose = require("mongoose");
const passport = require("passport");
const User = require('../models/user');
const _ = require('lodash/string');
const Order = require("../models/order");

//GET ACCOUNT ROUTE

exports.getUserAccount = async (req, res) => {

  if (req.isAuthenticated()) {
    username = req.user.username;

    await User.findOne({
      username: username
    }, (err, user) => {

      Order.findOne({
        username: username
      }, (err, order) => {

        let name = user.firstname;
        name = _.capitalize(name);
        name = _.trim(name);
        console.log(order);
        if (order) {
          res.render("user/account", {
            plan: order.subscription[0].title,
            name: name.split(" ")[0],
            loggedin: true
          });
        } else {
          res.render("user/account", {
            plan: "none",
            name: name.split(" ")[0],
            loggedin: true
          });
        }
      });
    });

  } else {
    res.redirect("login");
  }
};

//Get orders
exports.getOrders = async (req, res) => {


  await Order.find({
    username: req.user.username
  }, (err, orders) => {
    if(err){
      console.log(err);
    }
    if(orders){
    console.log(orders);
    res.render("user/user-orders", {
      orders:orders,
      loggedin: true
    });
  }
  if(!orders){
    res.render("user/user-orders", {
      orders:[],
      loggedin: true
    });
  }
  });

};

//LOG OUT OF ACCOUNT
exports.getLogout = (req, res) => {
  req.logout();
  res.render("home", {
    loggedin: false,
    errors: [],
    login: false,
    modal: false
  });
};
