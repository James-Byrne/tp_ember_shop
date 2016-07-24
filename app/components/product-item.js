import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    addToCart (product) {
      this.get('cart').add(product);
    }
  }
});
