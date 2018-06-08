import Ember from 'ember';
import Validations from 'ember-credit-cards/utils/validations';
import Cards from 'ember-credit-cards/utils/cards';

const { Component, computed, $ } = Ember;

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

  init() {
    this._super(...arguments);

    // Format the totals when entering
    this.format_totals();
  },

  didRender() {
    this._super(...arguments);

    // Enable bootstrap tooltips
    $('[data-toggle="tooltip"]').tooltip();

    $('#cardNumberInfo').attr('data-original-title', this.get('card_number_info'));
    $('#total-info').attr('data-original-title', this.get('total_info'));
  },

  // Ensure that the total and converted are padded out to the format of : 10.00
  format_totals() {
    this.set('total', parseFloat(this.get('total'), 10).toFixed(2));
    this.set('convertedTotal', parseFloat(this.get('convertedTotal'), 10).toFixed(2));
  },

  // Re-calc the converted total when the total or currency changes
  converted_total: computed('total', 'currency', function() {
    switch (this.get('currency')) {
      case 'USD':
        return this.get('total') * 1.12;
      case 'EUR':
        return this.get('total');
      case 'GBP':
        return this.get('total') * 0.9;
      case 'RUB':
        return this.get('total') * 74.20;
      default:
        return this.get('total');
    }
  }),

  three_d_display: computed('3dsecure', function() {
    if (this.get('3dsecure') === 0) {
      return "Auth Only";
    } else {
      return "3D Secure Flow";
    }
  }),

  card_number_info: computed('api', function() {
    let holder;

    if (this.get('api') === 'realex') {
      holder = 'You can test some checkout scenarios against the Realex\'s test system but it only supports a small list API responses. You must also only use card numbers from the Realex list of test cards to get these responses. The list of card numbers is available at https://developer.realexpayments.com /#!/technical-resources/test-card.';
    } else {
      holder = 'With the TestingPays Sim, you can get any Realex response you like back in the transaction response using the amount field, below. You\'re not limited by any test card numbers. In fact, you can use any card number you like in this field, so long as it\'s valid Mod-10 format (e.g. 5195253120409072). You can even use your own card number.';
    }

    return holder;
  }),
  three_d_info: computed('api', function () {
    return 'Switch between 3D secure flow and regular flow for the payment. Enabling 3D secure flow (Verified by Visa) will lead you to a simulated bank page where normally you would put in your password / code to approve the transaction.';
  }),

  total_info: computed('api', function () {
    let holder;

    if (this.get('api') === 'realex') {
      holder = 'Enter any amount in this field. Enter any amount in this field. Realex’s test system ignores the amount aslong as it is over 0.50';
    } else {
      holder = 'The TestingPays sim uses the amount field to know what specific API response to send back from our Realex sim. Example: X.01 will get a success, X.21 will get a specific decline. Sign up for free to see the full list of API response mappings.';
    }

    return holder;
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
    change_3dsecure: function(sec) {
      this.set('3dsecure', sec);
      $('#3d-selection').html(this.get('three_d_display') + ' <span class="caret"></span>');
    },

    change_currency: function(currency) {
      // Change the currency in the dropdown menu
      $('#currency-selection').html(currency + ' <span class="caret"></span>');

      // Pass the change up to the payment-form component
      this.set('currency', currency);
    }
  }
});
