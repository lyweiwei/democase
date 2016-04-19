import $ from 'jquery';
import LoginForm from 'login-form';

$(() => {
  $('body').append(new LoginForm().render().$el);
});
