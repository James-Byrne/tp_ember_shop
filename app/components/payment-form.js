import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service('store'),

  currencySelection: 'EUR',
  disabled: true,

  cartItems: Ember.computed('store.product.@each', function() {
    return this.get('store').peekAll('product');
  }),

  total: Ember.computed('cartItems.@each', function() {
    let total = 0;
    this.get('cartItems').forEach((obj) => {
      total += parseInt(obj.get('price'));
    });
    return total;
  }),

  convertedTotal: Ember.computed('currencySelection', 'total', function() {
    // TODO : Update the currency and total
    return this.get('total');
  }),

  actions: {
    validate: function(bool) {
      this.set('disabled', !bool);
    },

    updateCurrency: function(currency) {
      this.set('currencySelection', currency);
    },

    submitPayment: function() {
      // TODO : submit a payment to the correct processor
      Ember.$.ajax({
        url: 'http://demo-shop-realex.testingpays.com/api/pay',
        type: 'POST',
        data: {
          firstName: this.get('name'),
          lastName: this.get('name'),
          cardNumber: this.get('number'),
          expiryMonth: this.get('month'),
          expiryYear: this.get('year'),
          cvv: this.get('cvc'),
          api: this.get('api'),
          total: this.get('total'),
          currency: this.get('currencySelection')
        }
      }).done(function(res) {
        console.log('Hi there ', res);
        // Create the new response item
        // createResponse(res);
      }).fail(function(err) {
        // createFunctionalResponse('timeout');
        console.log(err);
      });
    }
  }
});
