import Ember from 'ember';
import Validations from 'ember-credit-cards/utils/validations';
import Cards from 'ember-credit-cards/utils/cards';

const {Component, observer, computed} = Ember;

/**
 * The below code is the same as the code found within the ember-credit-cards
 * addons credit-card-form component see file on github :
 * https://github.com/arenoir/ember-credit-cards/blob/master/addon/components/credit-card-form.js
 */

export default Component.extend({
  tagName: 'form',
  classNames: ['credit-card-form'],
  classNameBindings: ['isValid'],

  total: null,
  currency: null,
  convertedTotal: 0,

  setup: Ember.on('didInsertElement', function() {
    // Enable bootstrap tooltips
    Ember.$('[data-toggle="tooltip"]').tooltip();

    Ember.$('#toggle-provider').change(() => {
      this.set('api', (Ember.$('#toggle-provider').prop('checked')) ? 'realex': 'testingpays');
    });

    this.format_totals();
  }),

  // Ensure that the total and converted are padded out to the format of : 10.00
  format_totals() {
    this.set('total', parseFloat(this.get('total'), 10).toFixed(2));
    this.set('convertedTotal', parseFloat(this.get('convertedTotal'), 10).toFixed(2));
  },

  // Re-calc the converted total when the total or currency changes
  converted_total: computed('total', 'currency', function() {
    switch (this.get('currency')) {
      case "USD":
        return this.get('total') * 1.12;
      case "EUR":
        return this.get('total');
      case "GBP":
        return this.get('total') * 0.9;
      case "RUB":
        return this.get('total') * 74.20;
      default:
        return this.get('total');
    }
  }),

  /**
   *
   * Validation checks
   *
   */

  isValid: computed.and('nameValid', 'numberValid', 'expirationValid', 'cvcValid'),

  nameValid: computed('name', function() {
    return (this.get('name')) ? true : false;
  }),

  numberValid: computed('number', function() {
    return Validations.validateNumber(this.get('number'));
  }),

  expirationValid: computed('month', 'year', function() {
    return Validations.validateExpiration(this.get('month'), this.get('year'));
  }),

  cvcValid: computed('cvc', 'type', function() {
    return Validations.validateCVC(this.get('cvc'), this.get('type'));
  }),

  type: computed('number', function() {
    var card = Cards.fromNumber(this.get('number'));

    if (card) {
      return card.type;
    }
  }),

  actions: {
    pad_totals: function () {
      this.format_totals();
    },

    change_currency: function(currency) {
      // Change the currency in the dropdown menu
      Ember.$('#currency-selection').html(currency + ' <span class="caret"></span>');

      // Pass the change up to the payment-form component
      this.set('currency', currency);
    }
  }
});
