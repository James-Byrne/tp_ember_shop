import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  actions: {
    addToCart (product) {
      this.get('store').createRecord('product', product);
    }
  }
});
