import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('payments-demo-section', 'Integration | Component | payments demo section', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{payments-demo-section}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#payments-demo-section}}
      template block text
    {{/payments-demo-section}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
