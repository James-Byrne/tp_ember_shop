import Ember from 'ember';

export default Ember.Controller.extend({
  cartItems: Ember.computed('property', function() {
    return this.get('store').peekAll('product');
  }),
  products: [{
      name: 'test',
      price: 100.00
    }, {
      name: 'test',
      price: 100.00
    }, {
      name: 'test',
      price: 100.00
    }, {
      name: 'test',
      price: 100.00
    }, {
      name: 'test',
      price: 100.00
    }, {
      name: 'test',
      price: 100.00
    }, {
      name: 'test',
      price: 100.00
    }, {
      name: 'test',
      price: 100.00
    }, {
      name: 'test',
      price: 100.00
    }]
});
