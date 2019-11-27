require('dotenv').config();
const express = require('express');
const mongoose = require("mongoose");
const Product = require('../models/product');
const User = require('../models/user');
const Cart = require('../models/cart');
const Order = require('../models/order');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.getProducts = (req, res, next) => {
  res.render("products", {
    modal: false,
    errors: [],
    login: false,
    loggedin: req.isAuthenticated()
  });

};


exports.getSubscribe = (req, res) => {

  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});
  let products;

  Product.findById(productId, (err, product) => {

    if (req.isAuthenticated()) {
      stripe.checkout.sessions.create({
        customer_email: req.user.username,
        payment_method_types: ['card'],
        subscription_data: {
          items: [{
            plan: product.stripeId
          }],
        },
        success_url: req.protocol + '://' + req.get('host') + '/checkout/success/{CHECKOUT_SESSION_ID}', //'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel' //'https://example.com/cancel',
      }, (err, session) => {
        if (err) {
          console.log(err);
        }
        if (session) {
          res.render("checkout/sub", {
            sub: product,
            // subInCart: cart.hasSub(),
            modal: false,
            errors: [],
            sessionId: session.id,
            login: false,
            user: req.user,
            loggedin: req.isAuthenticated()
          });
        }
      });
    } else {
      stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        subscription_data: {
          items: [{
            plan: product.stripeId
          }],
        },
        success_url: req.protocol + '://' + req.get('host') + '/checkout/success/{CHECKOUT_SESSION_ID}', //'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel' //'https://example.com/cancel',
      }, (err, session) => {
        if (err) {
          console.log(err);
        }
        if (session) {
          res.render("checkout/sub", {
            sub: product,
            modal: false,
            errors: [],
            sessionId: session.id,
            login: false,
            user: req.user,
            loggedin: req.isAuthenticated()
          });
        }
      });
    }
  });


};




exports.getCheckoutSuccess = (req, res) => {

  const sessionId = req.params.session;
  // req.session.cart.clearCart();

  stripe.checkout.sessions.retrieve(
    sessionId,
    function(err, session) {

      if (err) {
        console.log(err);
      }

      if (session) {

        stripe.customers.retrieve(
          session.customer,
          function(err, customer) {

            if (err) {
              console.log(err);
            }

            if (customer) {
              console.log(customer.subscriptions.data[0].plan.nickname);

              Product.find({
                title: customer.subscriptions.data[0].plan.nickname
              }, (err, product) => {
                if (err) {
                  (console.log(err));
                }

                if (product) {
                  const order = new Order({
                    subscription: product,
                    username: customer.email,
                    trackingNumber: "No tracking yet"
                  });
                  order.save();
                  res.render("checkout/order-success", {
                    modal: false,
                    order: order,
                    errors: [],
                    login: false,
                    loggedin: req.isAuthenticated()
                  });
                }
              });
            }
          });
      }
    });
};
