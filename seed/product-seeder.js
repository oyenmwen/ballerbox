//jshint esversion:9

const Product = require('../models/product');
const mongoose =require("mongoose");
const connectDB = require("../config/db");

connectDB();

const products = [
  new Product({
    title: "All Star Subscription",
    description: "Blaze through the competition with our All Star plan: An HD poster, and accessory and a mystery item. Yes at that price ",
    price: 15
  }),
  new Product({
    title: "GOAT Subscription",
    description: "Soar like a living legend with our G.O.A.T plan: Enjoy a top item, an accessory, two HD posters and a mystery item. Fitting plan for the greatest",
    price: 34
  })
];

var done = 0;
products.forEach((product) => {
  product.save((err, result) => {
    done +=1;
    if(done==products.length){
      mongoose.connection.close();
    }
  });
});
