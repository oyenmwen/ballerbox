const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  subscription: Object,
  username: String,
  trackingNumber:String,
  
});

module.exports = mongoose.model('Order', orderSchema);
