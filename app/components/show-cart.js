import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),

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

  total: Ember.computed('cartItems.@each', function() {
    let total = 0;
    this.get('cartItems').forEach((obj) => {
      total += parseInt(obj.get('price'));
    });
    return total;
  }),

  actions: {
    removeItem(id) {
      const product = this.get('store').peekRecord('product', id);
      product.deleteRecord();
    }
  }
});
