import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),

  actions: {
    rest: function () {
      // Do nothing
    },

    reset: function () {
      this.get('store').unloadAll();
    },

    threeDSecure: function () {
      // Waiting on 3D secure implementation
    },

    highlight: function (fields_to_highlight) {
      this.highlight(fields_to_highlight);
    },

    contactUs: function () {
      let obj = {
        checkoutmessage: 'How can we help?',
        description: 'Hi! How can I help you?',
        checkoutOptions: {
          'Close': 'rest'
        }
      };

      this.set('functionalResponse', obj);
    },

    change_currency: function (currency) {
      this.change_currency(currency);
    },

    otherProcessor: function () {
      window.location.replace('https://www.paypal.com/ie/webapps/mpp/home');
    },

    retry: function () {
      this.retry();
    }
  }
});
