import Ember from 'ember';

export default Ember.Controller.extend({
  sideMenu: Ember.inject.service(),
  // Preset values for the user
  name: "Jamie Jones",
  number: "4111 1111 1111 1111",
  month: "10",
  year: "21",
  cvc: "222",
  total: 0.00,
  currency: "EUR",
  api: "realex",
  responses: [],

  products: [{
      name: 'Wheel of Time',
      price: 10.12,
      image: "http://images.mobilism.org/?dm=3NHQ"
    }, {
      name: 'Excession',
      price: 12.15,
      image: "http://www.iain-banks.net/lib/Excession.jpg"
    }, {
      name: 'Wise Mans Fear',
      price: 8.85,
      image: "https://upload.wikimedia.org/wikipedia/en/8/81/The_Wise_Man's_Fear_UK_cover.jpg"
    }],

  create_response(raw_xml) {
    let xml = Ember.$(Ember.$.parseXML(raw_xml));
    var xml_string = (new XMLSerializer()).serializeToString(Ember.$.parseXML(raw_xml));

    let response = {
      result: xml.find('result').text(),
      orderid: xml.find('orderid').text(),
      message: xml.find('message').text(),
      batchid: xml.find('batchid').text(),
      authcode: xml.find('authcode').text(),
      xml: xml_string
    };

   this.get('responses').pushObject(response);
  },

  actions: {
    open_side_menu: function() {
      if (this.get('sideMenu.isClosed')) {
        this.get('sideMenu').open();
      }

      Ember.$(".sideways.tabs-right").css('right','33%');
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
      }).done((res) => {
        // Create the new response item
        this.create_response(res);
      }).fail(function() {
        // createFunctionalResponse('timeout');
      });
    }
  }
});
