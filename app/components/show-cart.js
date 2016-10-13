import Ember from 'ember';
import ScrollMixin from '../mixins/scrolling';

export default Ember.Component.extend(ScrollMixin, {
  store: Ember.inject.service(),

  didInsertElement: (function() {
    return this._bindScrollingElement();
  }),

  willRemoveElement: (function() {
    return this._unbindScrolling();
  }),

  _onScroll: (function() {
    const cart = Ember.$('#cart');
    const payment_section = Ember.$('#payment-section');

    if ((cart.offset().top + cart.height()) >= payment_section.offset().top) {
      cart.offset({
        top: (payment_section.offset().top - cart.height())
      });
    } else {
      cart.offset({top: Ember.$(window).scrollTop() + 100});
    }
  }),

  cartItems: Ember.computed('store.@each', function() {
    return this.get('store').peekAll('product');
  }),

  cartSortedItems: Ember.computed('cartItems.@each', function() {
    const items = [];

    // Get each each unique product
    this.get('cartItems').mapBy('name').uniq().forEach(function(item) {
      items[item] = [];
    });

    // Assign values to each product
    this.get('cartItems').forEach(function(item) {
      items[item.get('name')].price = item.get('price');

      /**
       * Everytime removeItem is called it removes the item
       * with the id specified below. This value is then re-computed and
       * another id is assigned until all records with that product name
       * are deleted
       */
      items[item.get('name')].id = item.get('id');

      if (items[item.get('name')].amount) {
        items[item.get('name')].amount += 1;
      } else {
        items[item.get('name')].amount = 1;
      }
    });

    return items;
  }),

  observe_total: Ember.observer('cartItems.@each', function() {
    let total = 0;
    this.get('cartItems').forEach((obj) => {
      total += parseFloat(obj.get('price'));
    });
    this.set('total', parseFloat(total, 10).toFixed(2));
  }),

  actions: {
    removeItem(id) {
      const product = this.get('store').peekRecord('product', id);
      product.deleteRecord();
    }
  }
});
