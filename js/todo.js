function ToDo(cnt) {

  var $cnt = $(cnt);
  var $tasksHolder = $cnt.find('.tasks-list');
  var id = 0;
  var completedClass = 'completed';
  var eventNS = 'todo';
  var $taskNameInput = $cnt.find('.task-name-input');
  var filterQuery = 'all';
  var $filterBtns = $cnt.find('.filters .btn');
  var data = [];

  _restoreTasks();
  _handleEvents();

  function generateTpl({id, text = 'New task', status = false}) {
    return `<div class="input-group task ${status ? 'completed' : ''}" data-id="${id}">
      <span class="input-group-addon">
        <input type="checkbox" class="check" ${status ? 'checked' : ''} aria-label="Checkbox for following text input">
      </span>
      <input type="text" class="form-control task-name" readonly="" value="${text}">
      <span class="input-group-addon delete-task">X</span>
    </div>`;
  }

  function _handleEvents() {

    // Add task
    $cnt.find('.add-task-form').on(`submit.${eventNS}`, function () {
      addTask($taskNameInput.val());
      $taskNameInput.val('').focus();
      return false;
    });

    // Delete task
    $cnt.on(`click.${eventNS}`, '.delete-task', function () {
      var id = $(this).closest('.task').data('id');
      removeTask(id);
    });

    // Toggle task status
    $cnt.on(`change.${eventNS}`, '.check', function () {
      var id = $(this).closest('.task').data('id');
      this.checked ? checkTask(id) : uncheckTask(id);
    });

    // Filters
    $filterBtns.on(`click.${eventNS}`, function () {
      $filterBtns.removeClass('btn-primary');
      filter($(this).data('filter'));
      $filterBtns.filter(`[data-filter="${filterQuery}"]`).addClass('btn-primary');
    });

    $filterBtns.filter(`[data-filter="${filterQuery}"]`).addClass('btn-primary');
    filter(filterQuery);

    // Update task
    $cnt.on(`dblclick.${eventNS}`, '.task-name', function () {
      $(this).removeAttr('readonly').focus().select();
    });

    $cnt.on(`blur.${eventNS}`, '.task-name', function () {
      $(this).attr('readonly', true);
    });

    $cnt.on(`keypress.${eventNS}`, '.task-name', function (e) {
      if (e.keyCode === 13) {
        $(this).blur();
      }
    });

  }

  /**
   * Get task element by id
   * @param  {Number} id - id of the task
   * @return {Object}    - jQuery selection of the task
   */
  function _getTaskIndex(id) {
    return data.findIndex(function (el) {
      return el.id === id;
    });
  }
  
  /**
   * Add new task
   * @param {String} str - task description
   */
  function addTask(str) {

    data.push({
      id: id++,
      text: str,
      status: false
    });

    todoChange();
    
  }
  
  /**
   * Remove existing task
   * @param  {Number} id - id of the task
   */
  function removeTask(id) {
    var index = _getTaskIndex(id);

    if (index === -1) { return; }
    
    data.splice(index, 1);

    todoChange();
    
  }
  
  /**
   * Edit existing task
   * @param  {Number} id  - id of the task
   * @param  {String} str - new description of the task
   */
  function updateTask(id, str) {
    var index = _getTaskIndex(id);
    data[index].text = str;
    todoChange();
  }
  
  /**
   * Make task completed
   * @param  {Numbe} id - task id
   */
  function checkTask(id) {
    var index = _getTaskIndex(id);
    data[index].status = true;
    todoChange();
  }

  /**
   * Make task uncompleted
   * @param  {Number} id - task id
   */
  function uncheckTask(id) {
    var index = _getTaskIndex(id);
    data[index].status = false;
    todoChange();
  }

  /**
   * Callback which fired when task status is changed
   */
  function todoChange() {
    saveTasks();
    _render(data);
    filter(filterQuery);
  }

  function _render(data) {
    var html = convertToHtml(data);
    $tasksHolder.html(html);
  }
  
  /**
   * Filtering tasks list
   * @param  {String} query (All, completed, uncompleted) - query for filtering
   */
  function filter(query) {
    var $tasks = $tasksHolder.find('.task');
    var $filtered;

    switch (query) {
      case 'completed':
        $filtered = $tasks.filter('.completed');
        break;
      case 'uncompleted':
        $filtered = $tasks.not('.completed');
        break;
      default:
        $filtered = $tasks;
        break;
    }

    $filtered.removeClass('hide');
    $tasks.not($filtered).addClass('hide');
    filterQuery = query;
  }

  function _restoreTasks() {
    data = JSON.parse(localStorage.getItem('tasks'));
    id = data[data.length - 1].id++;
    _render(data);
  }

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(data));
  }

  /**
   * Convert jquery elements to the data object
   * @param  {Object} $tasks - jQuery selection of tasks list
   * @return {Array}        - data object of the tasks
   */
  function convertToData($tasks) {
    return $tasks.toArray().map(function (el) {
      var $el = $(el);
      return {
        id: $el.data('id'),
        text: $el.find('.task-name').val(),
        status: $el.find('.check').is(':checked')
      }
    });
  }

  /**
   * Convert data object to the html string
   * @param  {Object} data - data object of the tasks
   * @return {String}      - html string of the tasks 
   */
  function convertToHtml(data) {
    var str = '';
    if (!data) { return; }
    for (let task of data) {
      str += generateTpl(task);
    }
    return str;
  }
  
  return {
    addTask: addTask,
    removeTask :removeTask,
    updateTask: updateTask,
    checkTask: checkTask,
    uncheckTask: uncheckTask,
    filter: filter,
    saveTasks: saveTasks
  }

}

export { ToDo };