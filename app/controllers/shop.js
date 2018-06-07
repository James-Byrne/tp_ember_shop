import Ember from 'ember';
import ENV from '../config/environment';

const { Controller, computed, observer, $, inject } = Ember;

export default Controller.extend({
  queryParams: ['xml', 'three_d_return', 'three_d_cancelled'],
  three_d_return: false,
  three_d_cancelled: false,
  xml: "",

  response_codes: inject.service('response-codes'),
  tour_bot: inject.service('tour-bot'),
  term_url: ENV.three_d_return,

  transactionId: "T0001",
  total: '10.00',
  currency: 'EUR',
  api: 'testingpays',
  "3dsecure": 0,
  name: "Test C. Ard",
  number: "4242424242424242",
  year: "21",
  month: "12",
  cvc: "123",

  // Console & functional responses
  responses: [],
  functionalResponse: {},
  redirect: {},

  init() {
    this._super(...arguments);
    // After three seconds show the drawer to the user
    setTimeout(() => {
      this.checkFor3DResponse();
    }, 1000);

    setTimeout(() => {
      $('.response-drawer').css('right', 0);
    }, 3000);
  },

  // Check if we got a 3D response back
  checkFor3DResponse() {
    if (this.get('three_d_return')) {
      if (this.get('three_d_cancelled')) {
        $('#redirect-modal').modal('show');
      } else {
        this.create_response({xml: atob(this.get('xml')), three_d_return: this.get('three_d_return')})
      }
    }
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

  create_response(result) {
    let raw_xml = result.xml;
    let xml = $($.parseXML(raw_xml));
    var xml_string = (new XMLSerializer()).serializeToString($.parseXML(raw_xml));

    let response = {
      api: this.get('api'),
      result: xml.find('result').text(),
      orderid: xml.find('orderid').text(),
      message: xml.find('message').text(),
      batchid: xml.find('batchid').text(),
      authcode: xml.find('authcode').text(),
      xml: xml_string,
      three_d_return: result.three_d_return
    };

    // Generate a message from the tour bot
    this.get('tour_bot').valid_purchase(response);

    if (result.url && result.data && result.method) {
      // Create a redirect modal
      this.create_redirect(result);
    } else {
      this.get('responses').pushObject(response);
      this.create_functional_response(xml.find('result').text());
    }
  },

  create_redirect(obj) {
    // Set the term url on the object
    this.set('redirect', obj);
    $('#redirect-modal').modal('show');
  },

  create_functional_response(code) {
    this.set('functionalResponse', this.get('response_codes').get_response_code(code));

    // If we have a response available open the modal
    if (this.get('functionalResponse')) {
      $('#functional-response-modal').modal('show');
    }
  },

  merchant_data: computed('checkout_data', function() {
     return btoa(JSON.stringify(
         Ember.assign(
           this.get('checkout_data'),
           {
             transactionId: this.get('transactionId'),
             amount: this.get('total'),
             number: this.get('number')
           }
         )
     ));
  }),

  checkout_data: computed('name', 'number', 'month', 'year', 'cvc', 'api', 'total', 'currency', '3dsecure', function() {
      return {
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
      };
  }),

  checkout() {
    $.ajax({
      url: `${ENV.shop_url}/api/pay`,
      type: 'POST',
      data: this.get('checkout_data')
    }).done((res) => {
      // Create the new response item
      try {
        this.create_response(JSON.parse(res));
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
    },

    clear_three_d_params() {
      this.set('three_d_cancelled', false);
      this.set('three_d_return', false);
    }
  }
});
