import Ember from 'ember';

export default Ember.Component.extend({
  cart: Ember.inject.service('shopping-cart'),

  actions: {
    addToCart (product) {
      this.get('cart').add(product);
    }
  }
});
