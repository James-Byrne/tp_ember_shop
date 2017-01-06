import Ember from 'ember';

const { Service } = Ember;

export default Service.extend({
  events: null,
  tour_bot_responses: [],
  current_api: 'realex',


  init() {
    const EventedObject = Ember.Object.extend(Ember.Evented, {});

    let events = EventedObject.create();

    events.on('switched_to_realex', () => {
      this.get('tour_bot_responses').pushObject({
        api: this.get('current_api'),
        message: 'You\'ve pointed the online store to the Realex API (/auth endpoint). Don\'t worry, it\'s the test API endpoint so no real money is involved.'
      });
    });

    events.on('switched_to_testingpays', () => {
      this.get('tour_bot_responses').pushObject({
        api: this.get('current_api'),
        message: 'You\'ve now pointed the online store to the TestingPays sim for Realex.'
      });
    });

    events.on('card_number_field_focused_realex', () => {
      this.get('tour_bot_responses').pushObject({
        api: this.get('current_api'),
        message: 'To test with Realex\'s test API, you can\'t use any card number. Instead, Realex have preconfigured their test system to give a fixed response to particular card numbers. You must use one of the numbers from their small set list of cards to test agains their system. You can find here these cards here: <a href="https://developer.realexpayments.com/#!/technical-resources/test-card" target="_blank">list of Realex\'s test cards</a>'
      });
    });

    events.on('card_number_field_focused_testingpays', () => {
      this.get('tour_bot_responses').pushObject({
        api: this.get('current_api'),
        message: 'You can enter any card number in here when pointing at TestingPays. Just one thing: it must be a valid card number (i.e. mod-10). You can even use real card numbers. Don\'t worry, all transactions are test only... no real money is ever transacted.'
      });
    });

    events.on('purchase_amount_field_focused_testingpays', () => {
      this.get('tour_bot_responses').pushObject({
        api: this.get('current_api'),
        message: 'With the TestingPays sim, you can use the cent value (i.e. the digits to the right of the decimal) to generate any Realex API response for your development and testing. Example: X.01 will get a success, X.21 will get a specific decline. <a href="https://admin.testingpays.com/sign_up" target="_blank">Sign up</a> for free to see the full list of API response mappings.'
      });
    });

    events.on('purchase_amount_field_focused_realex', () => {
      this.get('tour_bot_responses').pushObject({
        api: this.get('current_api'),
        message: 'Realex\'s API sandbox supports any amount in this field. Instead, they use a fixed list of card numbers to generate specific API responses for your testing and development.'
      });
    });

    events.on('valid_purchase_testingpays', (response) => {
      let mapping = (response.result === '00') ? 'Success' : `Error ${response.result}`;

      this.get('tour_bot_responses').pushObject({
        api: this.get('current_api'),
        message: `You sent an amount to the sim, which mapped to ${mapping}.`
      });
    });

    events.on('valid_purchase_realex', (response) => {
      let mapping = (response.result === '00') ? 'Sucess' : `Error ${response.result}`;

      this.get('tour_bot_responses').pushObject({
        api: this.get('current_api'),
        message: `You sent a request to Realex, which returned ${mapping}.`
      });
    });


    this.set('events', events);
  },

  changed_api(api) {
    this.set('current_api', api);

    this.get('events').trigger(`switched_to_${api}`);
  },

  card_number_field_focused() {
    this.get('events').trigger(`card_number_field_focused_${this.get('current_api')}`);
  },

  purchase_amount_field_focused() {
    this.get('events').trigger(`purchase_amount_field_focused_${this.get('current_api')}`);
  },

  valid_purchase(response) {
    this.get('events').trigger(`valid_purchase_${this.get('current_api')}`, response);
  }
});
