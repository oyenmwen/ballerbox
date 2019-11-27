const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const shopController = require("../controllers/shop");
const legalController = require("../controllers/legal");

router.get('/products', shopController.getProducts);
router.get('/sub/:id', shopController.getSubscribe);
router.get('/privacy-policy', legalController.getPrivacyPolicy);
router.get('/terms', legalController.getTerms);
router.get('/shipping', legalController.getShippingTerms);
router.get('/cancellation', legalController.getCancellationPolicy);
router.get('/contact', legalController.getContact);
router.get('/checkout/cancel',(req,res) =>{
  res.redirect("/");
});
router.get('/checkout/success/:session', shopController.getCheckoutSuccess);

module.exports = router;
