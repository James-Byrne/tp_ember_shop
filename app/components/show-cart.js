import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  cartItems: Ember.computed('store.@each', function() {
    return this.get('store').peekAll('product');
  }),
  total: Ember.computed('cartItems.@each', function() {
    let total = 0;
    this.get('cartItems').forEach((obj) => {
      total += parseInt(obj.get('price'));
    });
    return total;
  }),

  actions: {
    removeItem(id) {
      this.get('store').findRecord('product', id).then(function(product) {
        product.deleteRecord();
      });
    }
  }
});
