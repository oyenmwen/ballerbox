require('dotenv').config();
const express = require('express');
const mongoose = require("mongoose");
const User = require('../models/user');
const _ = require('lodash');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const {
  check,
  validationResult
} = require('express-validator');

const transporter = nodemailer.createTransport(sendgridTransport({
   auth:{
     api_key:process.env.SENDGRID_API_KEY
   }
 }));

//GET REGISTER

exports.getRegister = (req, res) => {
  res.render("register");
};

//POST REGISTER

exports.postRegister = async (req, res) => {
  username = req.body.username;
  const firstname= req.body.fname;

  const errors = validationResult(req).array();

  if (!(errors === undefined || errors.length == 0)) {
    res.render("home", {
      loggedin: false,
      errors: _.uniqWith(errors, _.isEqual),
      login: false,
      modal:true
    });
  }else{
  User.findOne({
    username: req.body.username
  }, (err, user) => {
    if (err) {
      console.log(err);
    }

    if (user) {
      res.render("home", {
        loggedin: false,
        errors: [{
          msg: "Sorry that email already exists"
        }],
        login: false,
        modal:true
      });
    }
  });
  User.register({
      username: req.body.username,
      firstname: req.body.fname,
      lastname: req.body.lname,
      dateOfBirth: req.body.date,
      country: req.body.country,
      cart:{
        items:[]
      }
    },
    req.body.password,
    (err, user) => {
      if (err) {
        console.log(err);
        // res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.render("user/post-sign-up",{
            loggedin: true,
            firstname:firstname,
            errors: [],
            login: false,
            modal:false
          });
        });
        transporter.sendMail({
          to: username,
          from: "noreply@ballerbox.ca",
          subject: "Welcome "+ firstname +"!",
          html: `
          <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta http-equiv="Content-type" content="text/html; charset=utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" /> <meta http-equiv="X-UA-Compatible" content="IE=edge" /><meta name="format-detection" content="date=no" /><meta name="format-detection" content="address=no" /><meta name="format-detection" content="telephone=no" /><meta name="x-apple-disable-message-reformatting" /> <link href="https://fonts.googleapis.com/css?family=Kreon:400,700|Playfair+Display:400,400i,700,700i|Raleway:400,400i,700,700i|Roboto:400,400i,700,700i" rel="stylesheet" /><title>Welcome to the Baller Box Family</title><style type="text/css" media="screen">/* Linked Styles */body { padding:0 !important; margin:0 !important; display:block !important; min-width:100% !important; width:100% !important; background:#1e52bd; -webkit-text-size-adjust:none }a { color:#000001; text-decoration:none }p { padding:0 !important; margin:0 !important }img { -ms-interpolation-mode: bicubic; /* Allow smoother rendering of resized image in Internet Explorer */ }.mcnPreviewText { display: none !important; }.text-footer2 a { color: #ffffff; }/* Mobile styles */@media only screen and (max-device-width: 480px), only screen and (max-width: 480px) {.mobile-shell { width: 100% !important; min-width: 100% !important; }.m-center { text-align: center !important; }.m-left { text-align: left !important; margin-right: auto !important; }.center { margin: 0 auto !important; }.content2 { padding: 8px 15px 12px !important; }.t-left { float: left !important; margin-right: 30px !important; }.t-left-2 { float: left !important; }.td { width: 100% !important; min-width: 100% !important; }.content { padding: 30px 15px !important; }.section { padding: 30px 15px 0px !important; }.m-br-15 { height: 15px !important; }.mpb5 { padding-bottom: 5px !important; }.mpb15 { padding-bottom: 15px !important; }.mpb20 { padding-bottom: 20px !important; }.mpb30 { padding-bottom: 30px !important; }.mp30 { padding-bottom: 30px !important; }.m-padder { padding: 0px 15px !important; }.m-padder2 { padding-left: 15px !important; padding-right: 15px !important; }.p70 { padding: 30px 0px !important; }.pt70 { padding-top: 30px !important; }.p0-15 { padding: 0px 15px !important; }.p30-15 { padding: 30px 15px !important; }.p30-15-0 { padding: 30px 15px 0px 15px !important; }.p0-15-30 { padding: 0px 15px 30px 15px !important; }.text-footer { text-align: center !important; }.m-td,.m-hide { display: none !important; width: 0 !important; height: 0 !important; font-size: 0 !important; line-height: 0 !important; min-height: 0 !important; }.m-block { display: block !important; }.fluid-img img { width: 100% !important; max-width: 100% !important; height: auto !important; }.column,.column-dir,.column-top,.column-empty,.column-top-30,.column-top-60,.column-empty2,.column-bottom { float: left !important; width: 100% !important; display: block !important; }.column-empty { padding-bottom: 15px !important; }.column-empty2 { padding-bottom: 30px !important; }.content-spacing { width: 15px !important; }}</style></head><body class="body"style="padding:0 !important; margin:0 !important; display:block !important; min-width:100% !important; width:100% !important; background:#1e52bd; -webkit-text-size-adjust:none;"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ededed"><tr><td align="center" valign="top"><!-- Main --><table width="650" border="0" cellspacing="0" cellpadding="0" class="mobile-shell"><tr><td class="td" style="width:650px; min-width:650px; font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal;"><!-- Header --><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td class="p30-15" style="padding: 40px 0px 20px 0px;"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><th class="column-top" width="200"style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; vertical-align:top;"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td class="text-top m-center mpb5"style="color:#9babdb; font-family:'Raleway', Georgia, serif; font-size:11px; line-height:22px; text-align:left; text-transform:uppercase;"><div mc:edit="text_1">Welcome</div></td></tr></table></th></tr></table></td></tr><!-- END Top bar --><!-- Logo --><tr><td bgcolor="#ffffff" class="p30-15 img-center" style="padding: 30px; border-radius: 20px 20px 0px 0px; font-size:0pt; line-height:0pt; text-align:center;"><a href="ballerbox.ca" target="_blank"><img src="images/logo-footer" width="146" height="17" mc:edit="image_6" style="max-width:146px;" border="0" alt="" /></a></td></tr><!-- END Logo --><!-- Nav --><tr><td class="text-nav-white" bgcolor="#cf643c"style="color:#ffffff; font-family:'Roboto', Arial, sans-serif; font-size:12px; line-height:22px; text-align:center; text-transform:uppercase; padding:12px 0px;"><div mc:edit="text_2"><a href="ballerbox.ca" target="_blank" class="link-white"style="color:#ffffff; text-decoration:none;"><span class="link-white"style="color:#ffffff; text-decoration:none;">Home</span></a> &nbsp; &nbsp; &nbsp;<span class="m-hide"> &nbsp; &nbsp; </span><a href="ballerbox.ca/products" target="_blank" class="link-white"style="color:#ffffff; text-decoration:none;"><span class="link-white"style="color:#ffffff; text-decoration:none;">Subscriptions</span></a> &nbsp; &nbsp; &nbsp;<span class="m-hide"> &nbsp; &nbsp; </span><a href="ballerbox.ca/account" target="_blank" class="link-white"style="color:#ffffff; text-decoration:none;"><span class="link-white"style="color:#ffffff; text-decoration:none;">My Account</span></a></div></td></tr><!-- END Nav --></table><!-- END Header --><!-- Section 1 --><div mc:repeatable="Select" mc:variant="Section 1"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ebebeb"><tr><td class="fluid-img"style="font-size:0pt; line-height:0pt; text-align:left;"><img src="https://cdn.glitch.com/018eb89b-efae-47bd-96d1-a38d4794c3d7%2Fmj-winged.png?v=1574662496982" mc:edit="image_7" style="max-width:650px;" border="0" alt="" /></td></tr><tr><td class="p30-15-0" style="padding: 50px 30px 0px;" bgcolor="#ffffff"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td class="h5-center"style="color:#a1a1a1; font-family:'Raleway', Arial,sans-serif; font-size:16px; line-height:22px; text-align:center; padding-bottom:5px;"><div mc:edit="text_3">Our 5 Star Recruit</div></td></tr><tr><td class="h2-center"style="color:#000000; font-family:'Playfair Display', Times, 'Times New Roman', serif; font-size:32px; line-height:36px; text-align:center; padding-bottom:20px;"><div mc:edit="text_4">Welcome to the Baller Box family!</div></td></tr><tr><td class="text-center"style="color:#5d5c5c; font-family:'Raleway', Arial,sans-serif; font-size:14px; line-height:22px; text-align:center; padding-bottom:22px;"><div mc:edit="text_5">Our newest superstar! We hope to share our love for the game and cultivate your passion for basketball! Whether you subscribe or not, we still appreciate you for joining our community. </div></td></tr><tr><td align="center"><table border="0" cellspacing="0" cellpadding="0"><tr><td class="text-button-orange"style="background:#cf643c; color:#ffffff; font-family:'Kreon', 'Times New Roman', Georgia, serif; font-size:14px; line-height:18px; text-align:center; padding:10px 30px; border-radius:20px;"><div mc:edit="text_6"><a href="ballerbox.ca/login" target="_blank" class="link-white"style="color:#ffffff; text-decoration:none;"><span class="link-white"style="color:#ffffff; text-decoration:none;">Sign In</span></a></div></td></tr></table></td></tr></table></td></tr></table></div><!-- END Section 1 --><!-- Section 2 --><div mc:repeatable="Select" mc:variant="Section 2"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#dde8fd"><tr><td class="fluid-img"style="font-size:0pt; line-height:0pt; text-align:left;"><img src="https://cdn.glitch.com/018eb89b-efae-47bd-96d1-a38d4794c3d7%2Ffree_white_blue.jpg?v=1574662584677" width="650" height="162" mc:edit="image_8" style="max-width:650px;" border="0" alt="" /></td></tr><tr><td class="p0-15" style="padding: 0px 30px;"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td class="h2-center"style="color:#000000; font-family:'Playfair Display', Times, 'Times New Roman', serif; font-size:32px; line-height:36px; text-align:center; padding-bottom:60px; "><div mc:edit="text_7">Our Plans</div></td></tr><tr><td class="pb40"style="padding-bottom:40px;"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td class="event-separator"style="padding-bottom:40px; border-bottom:1px solid #ffffff;"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><th class="column-top" width="60"style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; vertical-align:top;"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td class="date"style="color:#000000; font-family:'Raleway', Arial,sans-serif; font-size:12px; line-height:16px; text-align:left; padding-bottom:6px;"><div mc:edit="text_8"></div></td></tr> <tr><td class="day"style="color:#1e52bd; font-family:'Raleway', Arial,sans-serif; font-size:40px; line-height:44px; text-align:left; font-weight:bold;"><div mc:edit="text_9">⭐️</div></td></tr></table></th><th class="column-empty" width="10"style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; direction:ltr;"></th><th class="column-top"style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; vertical-align:top;"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td class="h5-black black"style="font-family:'Raleway', Arial,sans-serif; font-size:14px; line-height:18px; text-align:left; padding-bottom:15px; text-transform:uppercase; font-weight:bold; color:#000000;"><div mc:edit="text_10">All Star Subscription</div></td></tr><tr><td class="text black"style="font-family:'Raleway', Arial,sans-serif; font-size:14px; line-height:22px; text-align:left; color:#000000;"><div mc:edit="text_11">A poster, an accessory and a mystery item</div></td></tr></table></th><th class="column-empty" width="10"style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; direction:ltr;"></th><th class="column-top" width="156"style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; vertical-align:top;"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td align="right"><table class="m-left" border="0" cellspacing="0" cellpadding="0"><tr><td class="text-button button-blue"style="font-family:'Kreon', Georgia, serif; font-size:14px; line-height:18px; text-align:center; padding:10px 30px; border-radius:20px; background:transparent; color:#1e52bd; border:1px solid #1e52bd;"><div mc:edit="text_12"><a href="ballerbox.ca/products" target="_blank" class="link-blue"style="color:#1e52bd; text-decoration:none;"><span class="link-blue"style="color:#1e52bd; text-decoration:none;">View More</span></a></div></td></tr></table></td></tr></table></th></tr></table></td></tr></table></td></tr><tr><td class="pb40"style="padding-bottom:40px;"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><th class="column-top" width="60"style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; vertical-align:top;"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td class="date"style="color:#000000; font-family:'Raleway', Arial,sans-serif; font-size:12px; line-height:16px; text-align:left; padding-bottom:6px;"><div mc:edit="text_13"></div></td></tr><tr><td class="day"style="color:#1e52bd; font-family:'Raleway', Arial,sans-serif; font-size:40px; line-height:44px; text-align:left; font-weight:bold;"><div mc:edit="text_14">🐐</div></td></tr></table></th><th class="column-empty" width="10"style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; direction:ltr;"></th><th class="column-top"style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; vertical-align:top;"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td class="h5-black black"style="font-family:'Raleway', Arial,sans-serif; font-size:14px; line-height:18px; text-align:left; padding-bottom:15px; text-transform:uppercase; font-weight:bold; color:#000000;"><div mc:edit="text_15">GOAT Subscription</div></td></tr><tr><td class="text black"style="font-family:'Raleway', Arial,sans-serif; font-size:14px; line-height:22px; text-align:left; color:#000000;"><div mc:edit="text_16">A top, an accessory, two posters and a mystery item</div></td></tr></table></th><th class="column-empty" width="10"style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; direction:ltr;"></th><th class="column-top" width="156"style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; vertical-align:top;"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td align="right"><table class="m-left" border="0" cellspacing="0" cellpadding="0"><tr><td class="text-button button-blue"style="font-family:'Kreon', Georgia, serif; font-size:14px; line-height:18px; text-align:center; padding:10px 30px; border-radius:20px; background:transparent; color:#1e52bd; border:1px solid #1e52bd;"><div mc:edit="text_17"><a href="ballerbox.ca/products" target="_blank" class="link-blue"style="color:#1e52bd; text-decoration:none;"><span class="link-blue"style="color:#1e52bd; text-decoration:none;">View More</span></a></div></td></tr></table></td></tr></table></th></tr></table></td></tr><tr><td align="center"><table border="0" cellspacing="0" cellpadding="0"><tr><td class="text-button button-blue2"style="font-family:'Kreon', Georgia, serif; font-size:14px; line-height:18px; text-align:center; padding:10px 30px; border-radius:20px; background:#1e52bd; color:#ffffff;"><div mc:edit="text_18"><a href="ballerbox.ca/products" target="_blank" class="link-white"style="color:#ffffff; text-decoration:none;"><span class="link-white"style="color:#ffffff; text-decoration:none;">View All Plans</span></a></div></td></tr></table></td></tr></table></td></tr></table></td></tr><tr><td class="fluid-img"style="font-size:0pt; line-height:0pt; text-align:left;"><img src="https://cdn.glitch.com/018eb89b-efae-47bd-96d1-a38d4794c3d7%2Ffree_blue_white.jpg?v=1574662577116" width="650" height="160" mc:edit="image_9" style="max-width:650px;" border="0" alt="" /></td></tr></table></div><!-- END Section 2 --><!-- White Padder --><div mc:repeatable="Select" mc:variant="White Padder"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff"><tr><td class="img mp30" style="padding-top: 70px; font-size:0pt; line-height:0pt; text-align:left;"></td></tr></table></div><!-- END White Padder --></td></tr></table><!-- END Main --></td></tr></table></body></html> `
        });
      }
    });
  }
};
