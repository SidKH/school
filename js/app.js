import HP from './helpers';
import {ToDo} from './todo';

(function ($) {

  // When DOM is ready
  $(function () {
    window.todo = ToDo('.todo-box');
  });

}(jQuery));