import Ember from 'ember';

const { Controller, computed, $, inject } = Ember;

export default Controller.extend({
  response_codes: inject.service('response-codes'),
  tour_bot: inject.service('tour-bot'),

  // Preset values for the user
  name: 'Jamie Jones',
  number: '4111 1111 1111 1111',
  month: '10',
  year: '21',
  cvc: '222',
  total: 0.00,
  currency: 'EUR',
  api: 'realex',
  responses: [],
  functionalResponse: {},

  init() {
    this._super(...arguments);

    // After three seconds show the drawer to the user
    setTimeout(function() {
      $('.response-drawer').css('right', 0);
    }, 3000);
  },

  currentApiText: computed('api', function() {
    return (this.get('api') === 'realex') ? 'Realex Test API' : 'TestingPays Sim';
  }),

  create_response(raw_xml) {
    let xml = $($.parseXML(raw_xml));
    var xml_string = (new XMLSerializer()).serializeToString($.parseXML(raw_xml));

    let response = {
      result: xml.find('result').text(),
      orderid: xml.find('orderid').text(),
      message: xml.find('message').text(),
      batchid: xml.find('batchid').text(),
      authcode: xml.find('authcode').text(),
      xml: xml_string
    };

    this.get('responses').pushObject(response);
    this.create_functional_response(xml.find('result').text());
  },

  create_functional_response(code) {
    this.set('functionalResponse', this.get('response_codes').get_response_code(code));

  // If we have a response available open the modal
    if (this.get('functionalResponse')) {
      $('#functional-response-modal').modal('show');
    }
  },

  checkout() {
    $.ajax({
      url: 'http://localhost:8001/api/pay',
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
        currency: this.get('currency')
      }
    }).done((res) => {
      // Create the new response item
      this.create_response(res);
    }).fail(function() {
      // createFunctionalResponse('timeout');
    });
  },

  retryPurchase() {
    this.set('total', '1.00');
    this.checkout();
  },

  actions: {
    swapAPI: function() {
      this.set('api', (this.get('api') === 'realex') ? 'testingpays' : 'realex');

      // Let tour bot know that the api has changed
      this.get('tour_bot').changed_api(this.get('api'));
    },

    openMenu: function() {
      $('.response-drawer').css('right', 0);
    },

    closeMenu: function() {
      $('.response-drawer').css('right', -400);
    },

    submitPayment: function() {
      this.checkout();
    },

    // Highlight the elements passed to the function
    highlight: function(fields_to_highlight) {
      let array = fields_to_highlight.split(',');

      // Go through array and highlight the selected fields
      array.forEach(function(item) {
        $(`#${item}`).css('border', '1px solid red');
      });
    },

    change_currency: function(currency) {
      // eslint-disable-next-line
      $('#currency-selection').html(currency + ' <span class="caret"></span>');

      // Change the value of the currency field to the selected currency
      this.set('currency', currency);

      // Re-submit for a success
      this.retryPurchase();
    },

    // Re-submit the form ensuring a success message
    retry: function() {
      this.retryPurchase();
    }
  }
});
