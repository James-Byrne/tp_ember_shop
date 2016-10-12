import Ember from 'ember';

export default Ember.Controller.extend({
  sideMenu: Ember.inject.service(),
  // Preset values for the user
  name: "Jamie Jones",
  number: "4111 1111 1111 1111",
  month: "10",
  year: "21",
  cvc: "222",
  total: "10.00",
  currency: "EUR",

  products: [{
      name: 'Product 1',
      price: 100.00
    }, {
      name: 'Product 2',
      price: 120.00
    }, {
      name: 'Product 3',
      price: 55.00
    }],

  actions: {
    open_side_menu: function() {
      if (this.get('sideMenu.isClosed')) {
        this.get('sideMenu').open();
      }

      Ember.$(".sideways.tabs-right").css('right','38%');
    },

    close_side_menu: function() {
      if (this.get('sideMenu.isOpen')) {
        this.get('sideMenu').close();
      }

      Ember.$(".sideways.tabs-right").css('right','-28px');
    },

    submitPayment: function() {
      Ember.$.ajax({
        url: "http://localhost:8001/api/pay",
        type: "POST",
        data: {
          firstName: this.get('name'),
          lastName: this.get('name'),
          cardNumber: this.get('number'),
          expiryMonth: this.get('month'),
          expiryYear: this.get('year'),
          cvv: this.get('cvc'),
          api: this.get('api'),
          total: this.get('total'),
          currency: this.get('currency')
        }
      }).done(function(res) {
        // Create the new response item
        // createResponse(res);
      }).fail(function(err) {
        // createFunctionalResponse('timeout');
      });
    }
  }
});
