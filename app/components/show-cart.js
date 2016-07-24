import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  cartItems: Ember.computed('store.@each.product', function() {
    return this.get('store').peekAll('product');
  }),
});
