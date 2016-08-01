import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('realex-credit-cards', 'Integration | Component | realex credit cards', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{realex-credit-cards}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#realex-credit-cards}}
      template block text
    {{/realex-credit-cards}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
