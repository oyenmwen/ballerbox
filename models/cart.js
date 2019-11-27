module.exports = function Cart(oldCart) {
  this.items = oldCart.items || {};
  this.totalQty = oldCart.totalQty || 0;
  this.totalPrice = oldCart.totalPrice || 0;

  this.add = function(item, id) {
    if (this.hasSub()) {
      return false;
    } else {
      var storedItem = this.items[id];
      if (!storedItem) {
        storedItem = this.items[id] = {
          item: item,
          qty: 0,
          price: 0
        };
      }
      storedItem.qty += 1;
      storedItem.price = storedItem.item.price * storedItem.qty;
      this.totalQty += 1;
      this.totalPrice += storedItem.item.price;
      return true;
    }

  };

  this.hasSub = function() {
    if (this.totalQty == 1 || this.items.length == 1) {
      return true;
    } else {
      return false;
    }
  };

  this.clearCart = function() {
    this.items = {};
    this.totalQty = 0;
    this.totalPrice = 0;
  };


  this.generateArray = function() {
    const arr = [];
    for (var id in this.items) {
      arr.push(this.items[id]);
    }
    console.log(arr);
    return arr;
  };
};
