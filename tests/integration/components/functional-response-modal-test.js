import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('functional-response-modal', 'Integration | Component | functional response modal', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{functional-response-modal}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#functional-response-modal}}
      template block text
    {{/functional-response-modal}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
