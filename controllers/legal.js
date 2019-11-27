//jshint esversion:9
const express = require('express');
const mongoose = require("mongoose");
const passport = require("passport");

//GET ACCOUNT ROUTE

exports.getPrivacyPolicy = (req, res)=>{
  res.render("legal/privacy-policy", {
    modal: false,
    errors: [],
    login: false,
    loggedin: req.isAuthenticated()
  });
};

exports.getTerms = (req, res)=>{
  res.render("legal/terms", {
    modal: false,
    errors: [],
    login: false,
    loggedin: req.isAuthenticated()
  });
};

exports.getShippingTerms = (req, res)=>{
  res.render("legal/shipping", {
    modal: false,
    errors: [],
    login: false,
    loggedin: req.isAuthenticated()
  });
};

exports.getCancellationPolicy = (req, res)=>{
  res.render("legal/cancellation", {
    modal: false,
    errors: [],
    login: false,
    loggedin: req.isAuthenticated()
  });
};

  exports.getContact = (req, res)=>{
    res.render("legal/contact", {
      modal: false,
      errors: [],
      login: false,
      loggedin: req.isAuthenticated()
    });
  };
