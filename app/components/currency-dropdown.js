import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    changeSelection: function(currency) {
      // Change the currency in the dropdown menu
      Ember.$('#currency-selection').html(currency + ' <span class="caret"></span>');

      // Pass the change up to the payment-form component
      this.get('updateCurrency')(currency);
    }
  }
});
