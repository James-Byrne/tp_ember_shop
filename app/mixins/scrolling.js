import Ember from 'ember';

export default Ember.Mixin.create({

  _onScroll: function () {},

  _scrollHandler: function () {
    const onScroll = this._onScroll.bind(this);
    return Ember.run.debounce(this, onScroll, 100);
  },

  _bindScrollingElement: (function() {
    const scrollHandler = this._scrollHandler.bind(this);
    Ember.$(document).bind('touchmove', scrollHandler);
    Ember.$(window).bind('scroll', scrollHandler);
  }).on('didInsertElement'),

  _unbindScrolling: (function() {
    Ember.$(window).unbind('scroll');
    Ember.$(document).unbind('touchmove');
  }).on('willDestroyElement')
});
