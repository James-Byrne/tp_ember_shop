import Ember from 'ember';
import Validations from 'ember-credit-cards/utils/validations';
import Cards from 'ember-credit-cards/utils/cards';

const {Component, computed} = Ember;

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

  setup: Ember.on('didRender', function() {
    // Enable bootstrap tooltips
    // eslint-disable-next-line
    Ember.$('[data-toggle="tooltip"]').tooltip();

    Ember.$('#toggle-provider').change(() => {
      this.set('api', (Ember.$('#toggle-provider').prop('checked')) ? 'realex': 'testingpays');
      Ember.$('#cardNumberInfo').attr('data-original-title', this.get('card_number_info'));
      Ember.$('#total-info').attr('data-original-title', this.get('total_info'));
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

  card_number_info: Ember.computed('api', function() {
    let holder;

    if (this.get('api') === 'realex') {
      holder = '4263970000005262 (00 - Successful)\
        4000120000001154 (101 - Declined)\
        4000130000001724 (102 - Referral B)\
        4000160000004147 (103 - Referral A)\
        4009830000001985 (200 - Comms Error)\
        5425230000004415 (00 - Successful)\
        5114610000004778 (101 - Declined)\
        5114630000009791 (102 - Referral B)\
        5121220000006921 (103 - Referral A)\
        5135020000005871 (200 - Comms Error)\
        374101000000608 (00 - Successful)\
        375425000003 (101 - Declined)\
        375425000000907 (102 - Referral B)\
        343452000000306 (103 - Referral A)\
        372349000000852 (200 - Comms Error)';
    } else {
      holder = 'When pointing at the TestingPays Sim, you can use any valid credit number in this field.';
    }

    return holder;
  }),

  total_info: Ember.computed('api', function () {
    let holder;

    if (this.get('api') === 'realex') {
      holder = 'Enter any amount in this field. Enter any amount in this field. Realex’s test system ignores the amount aslong as it is over 0.50';
    } else {
      holder = 'When pointing at TestingPays Sim, use the decimal part of the amount to get back the Realex API response you  want to test.\
Examples:\
\
123.00 (00 - Successful)\
52.10 (101_declined_bank)\
400.12 (103_card_stolen)\
76.21  (205_bank_comm)\
45.22 (507_currency)\
670.16 (603_error)';
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

    change_currency: function(currency) {
      // Change the currency in the dropdown menu
      // eslint-disable-next-line
      Ember.$('#currency-selection').html(currency + ' <span class="caret"></span>');

      // Pass the change up to the payment-form component
      this.set('currency', currency);
    }
  }
});
