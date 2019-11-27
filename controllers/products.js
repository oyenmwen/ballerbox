const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('products', {
        products: products
      });
    })
    .catch(err => {
      console.log(err);
    });
};
