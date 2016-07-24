import Ember from 'ember';

/**
 * A simple Ember service for managing the shops cart
 */

export default Ember.Service.extend({
  item: null,

  init() {
    this._super(...arguments);
    this.set('items', []);
  },

  add(item) {
    this.get('items').pushObject(item);
  },

  remove (item) {
    this.get('items').removeObject(item);
  },

  empty () {
    this.get('items').clear();
  }
});
