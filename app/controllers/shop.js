import Ember from 'ember';

export default Ember.Controller.extend({
  cart: Ember.inject.service('shopping-cart'),
  products: Ember.computed('property', function() {
    return [{
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
    }];
  }),
});
