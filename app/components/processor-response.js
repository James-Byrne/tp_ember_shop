import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    remove_response: function(response) {
      this.get('responses').removeObject(response);
    }
  }
});
