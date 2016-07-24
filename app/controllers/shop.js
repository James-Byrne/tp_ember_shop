import Ember from 'ember';

export default Ember.Controller.extend({
  products: Ember.computed('property', function() {
    return [1,2,3,4,5,6,7,8];
  }),
});
