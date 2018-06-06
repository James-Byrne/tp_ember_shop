import Ember from 'ember';
import ENV from '../config/environment';

const { Controller, computed, observer, $, inject } = Ember;

export default Controller.extend({
  response_codes: inject.service('response-codes'),
  tour_bot: inject.service('tour-bot'),

  total: '0.00',
  currency: 'EUR',
  api: 'realex',
  "3dsecure": 0,

  // Console & functional responses
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

  scroll_to_bottom_console: observer('responses.@each', function() {
    $('#api-console').animate({ scrollTop: $('#api-console')[0].scrollHeight }, 1000);
  }),

  scroll_to_bottom_tour: observer('tour_bot.tour_bot_responses.@each', function() {
    $('#tour-bot').animate({ scrollTop: $('#tour-bot')[0].scrollHeight }, 1000);
  }),

  create_response(raw_xml) {
    let xml = $($.parseXML(raw_xml));
    var xml_string = (new XMLSerializer()).serializeToString($.parseXML(raw_xml));

    let response = {
      api: this.get('api'),
      result: xml.find('result').text(),
      orderid: xml.find('orderid').text(),
      message: xml.find('message').text(),
      batchid: xml.find('batchid').text(),
      authcode: xml.find('authcode').text(),
      xml: xml_string
    };

    // Generate a message from the tour bot
    this.get('tour_bot').valid_purchase(response);

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
      url: `${ENV.shop_url}/api/pay`,
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
        currency: this.get('currency'),
        "3dsecure": this.get('3dsecure')
      }
    }).done((res) => {
      // Create the new response item
      try {
        const parsed = JSON.parse(res);
        this.create_response(parsed.xml);
        if (parsed.url) {
          console.log(parsed);
        }
      } catch (e) {
        this.create_response(res);
      }
    }).fail(function() {
      // createFunctionalResponse('timeout');
    });
  },

  retryPurchase() {
    this.set('total', '1.00');
    this.checkout();
  },

  actions: {
    swapAPI() {
      this.set('api', (this.get('api') === 'realex') ? 'testingpays' : 'realex');

      // Let tour bot know that the api has changed
      this.get('tour_bot').changed_api(this.get('api'));
    },

    openMenu() {
      $('.response-drawer').css('right', 0);
    },

    closeMenu() {
      $('.response-drawer').css('right', -400);
    },

    card_number_field_focused() {
      this.get('tour_bot').card_number_field_focused();
    },

    purchase_amount_field_focused() {
      this.get('tour_bot').purchase_amount_field_focused();
    },

    submitPayment() {
      this.checkout();
    },

    // Highlight the elements passed to the function
    highlight(fields_to_highlight) {
      let array = fields_to_highlight.split(',');

      // Go through array and highlight the selected fields
      array.forEach(function(item) {
        $(`#${item}`).css('border', '1px solid red');
      });
    },

    change_currency(currency) {
      // eslint-disable-next-line
      $('#currency-selection').html(currency + ' <span class="caret"></span>');

      // Change the value of the currency field to the selected currency
      this.set('currency', currency);

      // Re-submit for a success
      this.retryPurchase();
    },

    // Re-submit the form ensuring a success message
    retry() {
      this.retryPurchase();
    }
  }
});
