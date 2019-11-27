const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  stripeId: String,
});

module.exports = mongoose.model('Product', productSchema);
