import Ember from 'ember';

export default Ember.Service.extend({
  events: null,
  tour_bot_responses: [],
  current_api: 'realex',      // TODO make sure this is consistent

  // TODO : MAKE SURE THE LINKS BELOW WORK CORRECTLY

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
        message: 'When testing against Realex\'s systems, you can only use preconfigured credit card numbers to test a small set of card responses.'
      });
      this.get('tour_bot_responses').pushObject({
        api: this.get('current_api'),
        message: 'Click the little info tooltip beside the card number field to see the list of cards. There\'s a little bit more information on Realex\'s page here[link].'
      });
    });

    events.on('card_number_field_focused_testingpays', () => {
      this.get('tour_bot_responses').pushObject({
        api: this.get('current_api'),
        message: 'You can enter ANY card number when testing against the sim. You can even use your own card number - don\'t worry, the transaction is not real, so you won\'t get charged.'
      });
    });

    events.on('purchase_amount_field_focused', () => {
      this.get('tour_bot_responses').pushObject({
        api: this.get('current_api'),
        message: 'You can get any API response you like back from the sim by using a different cent or pence value in the amount field. Click the information icon beside the field to see some examples of common responses. Sign-up here to see the full list of API response mappings in the sim [LINK TO RELEAX MAPPINGS].'
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
        message: `You sent this amount to Realex, which returns ${mapping}.`
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
    this.get('events').trigger('purchase_amount_field_focused');
  },

  valid_purchase() {
    this.get('events').trigger(`valid_purchase_${this.get('current_api')}`);
  }
});
