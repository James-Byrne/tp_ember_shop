import Ember from 'ember';

export default Ember.Controller.extend({
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
