import Backbone from 'backbone';
import template from './index.jade';

export default class LoginForm extends Backbone.View {
  render() {
    this.$el.render(template());
    return this;
  }
}
