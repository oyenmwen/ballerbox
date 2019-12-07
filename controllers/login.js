const express = require('express');
const mongoose = require("mongoose");
const User = require('../models/user');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const {
  check,
  validationResult
} = require('express-validator');

const sendgridTransport = require("nodemailer-sendgrid-transport");
const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.SENDGRID_API_KEY
  }
}));


//GET LOGIN routes
exports.getLogin = (req, res) => {
  res.render("login", {
    loggedin: false,
    errors: [],
    login: false,
    modal: true
  });
};

//POST LOGIN routes

exports.postLogin = async (req, res, next) => {

  User.findOne({
    username: req.body.username
  }, (err, user) => {
    if (err) {
      console.log(err);
    }
    if (!user) {
      res.render("home", {
        loggedin: false,
        errors: [{
          msg: "Email is not associated with any accounts"
        }],
        login: true,
        modal: true
      });
    }
  });

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    // Redirect if it fails
    if (!user) {
      res.render("home", {
        loggedin: false,
        errors: [{
          msg: "Incorrect password"
        }],
        login: true,
        modal: true
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Redirect if it succeeds
      username = req.body.username;
      loggedin = true;
      res.render("home", {
        loggedin: true,
        errors: [],
        login: false,
        modal: false
      });
    });
  })(req, res, next);
};

//RESET Log In

exports.getReset = (req, res, next) => {
  const errors = validationResult(req).array();
  if (!(errors === undefined || errors.length == 0 || errors.length === undefined)) {
    res.render("auth/reset", {
      loggedin: false,
      errors: errors,
      modal: false,
      login:false
    });
  }
  res.render("auth/reset", {
    loggedin: false,
    errors: [],
    modal: false,
    login:false
  });
};

//Reset Posted

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      res.redirect('reset');
    }
    const token = buffer.toString('hex');
    User.findOne({
        username: req.body.username
      })
      .then(user => {
        if (!user) {
          res.render("auth/reset", {
            loggedin: false,
            errors: [{
              msg: "Sorry! No account with that email found"
            }],
            login: false,
            modal: false
          });
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 360000;
        return user.save();
      })
      .then(result => {
        res.render("auth/reset-sent", {
          loggedin: false,
          errors:[],
          modal: false
        });
        transporter.sendMail({
          to: req.body.username,
          from: "noreply@ballerbox.ca",
          subject: "BallerBox Password Reset!",
          html: `
          <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta http-equiv="Content-type" content="text/html; charset=utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" /> <meta http-equiv="X-UA-Compatible" content="IE=edge" /><meta name="format-detection" content="date=no" /><meta name="format-detection" content="address=no" /><meta name="format-detection" content="telephone=no" /><meta name="x-apple-disable-message-reformatting" /> <link href="https://fonts.googleapis.com/css?family=Kreon:400,700|Playfair+Display:400,400i,700,700i|Raleway:400,400i,700,700i|Roboto:400,400i,700,700i" rel="stylesheet" /><title>Welcome to the Baller Box Family</title><style type="text/css" media="screen">/* Linked Styles */body { padding:0 !important; margin:0 !important; display:block !important; min-width:100% !important; width:100% !important; background:#1e52bd; -webkit-text-size-adjust:none }a { color:#000001; text-decoration:none }p { padding:0 !important; margin:0 !important }img { -ms-interpolation-mode: bicubic; /* Allow smoother rendering of resized image in Internet Explorer */ }.mcnPreviewText { display: none !important; }.text-footer2 a { color: #ffffff; }/* Mobile styles */@media only screen and (max-device-width: 480px), only screen and (max-width: 480px) {.mobile-shell { width: 100% !important; min-width: 100% !important; }.m-center { text-align: center !important; }.m-left { text-align: left !important; margin-right: auto !important; }.center { margin: 0 auto !important; }.content2 { padding: 8px 15px 12px !important; }.t-left { float: left !important; margin-right: 30px !important; }.t-left-2 { float: left !important; }.td { width: 100% !important; min-width: 100% !important; }.content { padding: 30px 15px !important; }.section { padding: 30px 15px 0px !important; }.m-br-15 { height: 15px !important; }.mpb5 { padding-bottom: 5px !important; }.mpb15 { padding-bottom: 15px !important; }.mpb20 { padding-bottom: 20px !important; }.mpb30 { padding-bottom: 30px !important; }.mp30 { padding-bottom: 30px !important; }.m-padder { padding: 0px 15px !important; }.m-padder2 { padding-left: 15px !important; padding-right: 15px !important; }.p70 { padding: 30px 0px !important; }.pt70 { padding-top: 30px !important; }.p0-15 { padding: 0px 15px !important; }.p30-15 { padding: 30px 15px !important; }.p30-15-0 { padding: 30px 15px 0px 15px !important; }.p0-15-30 { padding: 0px 15px 30px 15px !important; }.text-footer { text-align: center !important; }.m-td,.m-hide { display: none !important; width: 0 !important; height: 0 !important; font-size: 0 !important; line-height: 0 !important; min-height: 0 !important; }.m-block { display: block !important; }.fluid-img img { width: 100% !important; max-width: 100% !important; height: auto !important; }.column,.column-dir,.column-top,.column-empty,.column-top-30,.column-top-60,.column-empty2,.column-bottom { float: left !important; width: 100% !important; display: block !important; }.column-empty { padding-bottom: 15px !important; }.column-empty2 { padding-bottom: 30px !important; }.content-spacing { width: 15px !important; }}</style></head><body class="body"style="padding:0 !important; margin:0 !important; display:block !important; min-width:100% !important; width:100% !important; background:#ededed; -webkit-text-size-adjust:none;"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ededed"><tr><td align="center" valign="top"><!-- Main --><table width="650" border="0" cellspacing="0" cellpadding="0" class="mobile-shell"><tr><td class="td" style="width:650px; min-width:650px; font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal;"><!-- Header --><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td class="p30-15" style="padding: 40px 0px 20px 0px;"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><th class="column-top" width="200"style="font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; vertical-align:top;"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr></tr></table></th></tr></table></td></tr><!-- END Top bar --><!-- Logo --><tr><td bgcolor="#ffffff" class="p30-15 img-center" style="padding: 30px; border-radius: 20px 20px 0px 0px; font-size:0pt; line-height:0pt; text-align:center;"><a href="ballerbox.ca" target="_blank"><img src="images/logo-foo" width="146" height="17" mc:edit="image_6" style="max-width:146px;" border="0" alt="" /></a></td></tr><!-- END Logo --><!-- Nav --><tr><td class="text-nav-white" bgcolor="#cf643c"style="color:#ffffff; font-family:'Roboto', Arial, sans-serif; font-size:12px; line-height:22px; text-align:center; text-transform:uppercase; padding:12px 0px;"><div mc:edit="text_2"><a href="ballerbox.ca" target="_blank" class="link-white"style="color:#ffffff; text-decoration:none;"><span class="link-white"style="color:#ffffff; text-decoration:none;">Home</span></a> &nbsp; &nbsp; &nbsp;<span class="m-hide"> &nbsp; &nbsp; </span><a href="ballerbox.ca/products" target="_blank" class="link-white"style="color:#ffffff; text-decoration:none;"><span class="link-white"style="color:#ffffff; text-decoration:none;">Subscriptions</span></a> &nbsp; &nbsp; &nbsp;<span class="m-hide"> &nbsp; &nbsp; </span><a href="ballerbox.ca/account" target="_blank" class="link-white"style="color:#ffffff; text-decoration:none;"><span class="link-white"style="color:#ffffff; text-decoration:none;">My Account</span></a></div></td></tr><!-- END Nav --></table><!-- END Header --><!-- Section 1 --><div mc:repeatable="Select" mc:variant="Section 1"><table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ebebeb"><tr><td class="fluid-img"style="font-size:0pt; line-height:0pt; text-align:left;"><img src="https://cdn.glitch.com/018eb89b-efae-47bd-96d1-a38d4794c3d7%2Fmj-winged.png?v=1574662496982" mc:edit="image_7" style="max-width:650px;" border="0" alt="" /></td></tr><tr><td class="p30-15-0" style="padding: 50px 30px 0px;" bgcolor="#ffffff"><table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td class="h5-center"style="color:#a1a1a1; font-family:'Raleway', Arial,sans-serif; font-size:16px; line-height:22px; text-align:center; padding-bottom:5px;"><div mc:edit="text_3">Our 5 Star Recruit</div></td></tr><tr><td class="h2-center"style="color:#000000; font-family:'Playfair Display', Times, 'Times New Roman', serif; font-size:32px; line-height:36px; text-align:center; padding-bottom:20px;"><div mc:edit="text_4">Password Reset Request</div></td></tr><tr><td class="text-center"style="color:#5d5c5c; font-family:'Raleway', Arial,sans-serif; font-size:14px; line-height:22px; text-align:center; padding-bottom:22px;"><div mc:edit="text_5">You created a password reset request, please click reset button to change your password</div></td></tr><tr><td align="center"><table border="0" cellspacing="0" cellpadding="0"><tr><td class="text-button-orange"style="background:#cf643c; color:#ffffff; font-family:'Kreon', 'Times New Roman', Georgia, serif; font-size:14px; line-height:18px; text-align:center; padding:10px 30px; border-radius:20px;"><div mc:edit="text_6"><a href="https://ballerbox.ca/reset/${token}" target="_blank" class="link-white"style="color:#ffffff; text-decoration:none;"><span class="link-white"style="color:#ffffff; text-decoration:none;">Reset</span></a></div></td></tr></table></td></tr></table></td></tr></table></div><!-- END Section 1 --><tr><td bgcolor="#ffffff" class="p30-15 img-center" style="padding: 30px;margin-bottom:70px; border-radius: 0px 0px 40px 40px; font-size:0pt; line-height:0pt; text-align:center;"><a href="ballerbox.ca" target="_blank"><img src="images/logo-foo" width="146" height="17" mc:edit="image_6" style="max-width:146px;" border="0" alt="" /></a></td></tr></td></tr></table><!-- END Main --></td></tr></table></body></html>
            `
        });
      });

  });

};

exports.getNewPassword = async (req, res, next) => {
  const token = req.params.token;

  await User.findOne({
      resetToken: token,
      resetTokenExpiration: {
        $gt: Date.now().toString().substring(0,5)
      }
    }).then(user => {

      if (!user) {
        res.render("auth/reset", {
          loggedin: false,
          errors: [{msg:"Error, please restart password reset request, link expired"}],
          modal: false,
          login:false
        });
      }
      if(user){
      res.render("auth/new-password", {
        loggedin: false,
        errors: [],
        login:false,
        modal: false,
        userId: user._id.toString(),
        passwordToken: token
      });
    }
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};




exports.postNewPassword = async (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  console.log(userId);
  const passwordToken = req.body.passwordToken;

  const errors = validationResult(req);

  if (!(errors === undefined || errors.length == 0 || errors.length === undefined)) {
    res.render("auth/new-password", {
      loggedin: false,
      errors: errors.array(),
      modal: false,
      login:false,
      userId: user._id.toString(),
      passwordToken: token
    });
  }
  await User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: {
        $gt: Date.now().toString().substring(0,5)
      },
      _id: userId
    })
    .then(user => {

      if (user) {
        user.setPassword(newPassword, function() {
          user.save();
          res.render("auth/reset-success", {
            loggedin: false,
            errors:[],
            modal: false,
            login:false
          });

            });
      }
      if (!user) {
        res.render("auth/new-password", {
          loggedin: false,
          errors: [{
            msg: "Link expiration, please reset password again "
          }],
          modal: false,
          login:false,
          userId: user._id.toString(),
          passwordToken: token
        });
      }
    }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
