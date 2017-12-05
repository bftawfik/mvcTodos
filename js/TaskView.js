var TaskView = function(model){
  this._model = model;

  this.addNewTaskEvent = new EventDispatcher(this);
  this.markAllAsEvent = new EventDispatcher(this);
  this.switchViewEvent = new EventDispatcher(this);
  this.changeTaskStatusEvent = new EventDispatcher(this);
  this.changeTaskNameEvent = new EventDispatcher(this);
  this.removeTaskEvent = new EventDispatcher(this);
  this.removeCompletedTasksEvent = new EventDispatcher(this);

  this.init()

}

TaskView.prototype = {
  init: function(){
    this.addElements()
    .makeEventHandelers()
    .addEventHandelers()
    .connectToModel();
  },

  addElements: function(){
    this.markAllAs_btn = document.getElementById('mvc-mark-all-as-button');
    this.newTask_txt = document.getElementById('mvc-new-task-textbox');

    this.tasks_div = document.getElementById('mvc-tasks-container');

    this.todoFooter =  document.getElementById('mvc-container').getElementsByTagName('footer')[0];
    this.tasksCounter_txt = document.getElementById('mvc-tasks-counter-label');
    this.showAll_btn = document.getElementById('mvc-show-all-button');
    this.showActive_btn = document.getElementById('mvc-show-active-button');
    this.showCompleted_btn = document.getElementById('mvc-show-completed-button');
    this.clearCompleted_btn = document.getElementById('mvc-footer-right').getElementsByTagName('a')[0];

    return this;
  },

  makeEventHandelers: function(){
    this.markAllAsHandler = this.markAllAs.bind(this);
    this.addNewTaskHandler = this.addNewTask.bind(this);

    this.tasksDivHandler = this.tasksDiv.bind(this);
    this.editTaskLabelHandler = this.editTaskLabel.bind(this);
    this.updateTaskHandler = this.updateTask.bind(this);

    this.showAllHandler = this.showAll.bind(this);
    this.showActiveHandler = this.showActive.bind(this);
    this.showCompletedHandler = this.showCompleted.bind(this);

    this.clearCompletedHandler = this.clearCompleted.bind(this);

    //---------------

    this.updateTasksDivHandler = this.updateTasksDiv.bind(this);
    this.clearNewTaskInputTextHandler = this.clearNewTaskInputText.bind(this);
    this.updateTasksCountHandler = this.updateTasksCount.bind(this);
    this.updateViewHandler = this.updateView.bind(this);
    return this;
  },

  addEventHandelers: function(){
    this.markAllAs_btn.addEventListener('click', this.markAllAsHandler);
    this.newTask_txt.addEventListener('keyup', this.addNewTaskHandler);

    this.tasks_div.addEventListener('click', this.tasksDivHandler);
    this.tasks_div.addEventListener('dblclick', this.editTaskLabelHandler);

    this.showAll_btn.addEventListener('click', this.showAllHandler);
    this.showActive_btn.addEventListener('click', this.showActiveHandler);
    this.showCompleted_btn.addEventListener('click', this.showCompletedHandler);

    this.clearCompleted_btn.addEventListener('click', this.clearCompletedHandler);

    return this;
  },

  connectToModel: function(){
    this._model.tasksUpdatedEvent.attach(this.updateTasksDivHandler);
    this._model.tasksUpdatedEvent.attach(this.clearNewTaskInputTextHandler);
    this._model.tasksUpdatedEvent.attach(this.updateTasksCountHandler);
    this._model.viewSwitchedEvent.attach(this.updateViewHandler);
  },


  addEventHandelerToTaskLabel: function(label){
    label.addEventListener('keyup', this.updateTaskHandler);
  },
  //---------------------------------------------------------------------------
  markAllAs: function(){
    this.markAllAsEvent.notify();
  },

  addNewTask: function(e){
    if (e.keyCode == 13) {
      this.addNewTaskEvent.notify({taskName: this.newTask_txt.value});
    }
  },

  tasksDiv: function(e){
    var emptyCheckBoxClass = "fa fa-square-o";
    var filledCheckBoxClass = "fa fa-check-square-o";
    var labelClass = "";
    var closeButtonClass = "fa fa-times";
    if(e.target.classList.value == emptyCheckBoxClass || e.target.classList.value == filledCheckBoxClass){
      var taskId = parseInt(e.path[2].classList[1]);
      this.changeTaskStatusEvent.notify({taskId: taskId});
    }else if(e.target.classList.value == closeButtonClass){
      var taskId = parseInt(e.path[2].classList[1]);
      this.removeTaskEvent.notify({taskId: taskId});
    }
  },

  editTaskLabel: function(e){
    if(e.target.type == "text"){
      if(e.path[1].classList.value == "mvc-task-label-uncomplete"){
        e.target.disabled = false;
        e.target.focus();
        e.target.select();
        this.addEventHandelerToTaskLabel(e.target);
      }
    }
  },

  updateTask: function(e){
    if (e.keyCode == 13) {
      e.target.disabled = true;
      var taskId = parseInt(e.path[2].classList[1]);
      var taskName = e.target.value;
      this.changeTaskNameEvent.notify({taskId: taskId, taskName: taskName});
      e.target.removeEventListener('keyup', this.updateTaskHandler);
    }
  },

  showAll: function(){
    this.switchViewEvent.notify({viewName: "all"});
  },

  showActive: function(){
    this.switchViewEvent.notify({viewName: "uncomplete"});
  },

  showCompleted: function(){
    this.switchViewEvent.notify({viewName: "completed"});
  },

  clearCompleted: function(){
    this.removeCompletedTasksEvent.notify();
  },
  //---------------------------------------------------------------------------
  updateTasksDiv: function(owner, args){
    var currentView = args.currentView;
    var tasks = args.tasks;
    var allElementsData = '';
    this.tasks_div.innerHTML = allElementsData;
    if(tasks.length == 0){
      this.markAllAs_btn.classList.add("hiddenBtn");
      this.todoFooter.classList.add("hiddenFooter");
    }else{
      this.markAllAs_btn.classList.remove("hiddenBtn");
      this.todoFooter.classList.remove("hiddenFooter");
      for (var tasksCount = 0; tasksCount < tasks.length; tasksCount++) {
        if(currentView == tasks[tasksCount].status || currentView == 'all'){
          allElementsData += "<div class='mvc-single-task-container "+tasksCount+"'>";
          allElementsData += "<button type='button' name='button' class='icon-button'><span class='fa fa";
          if(tasks[tasksCount].status == 'completed'){
            allElementsData += "-check";
          }
          allElementsData += "-square-o'  aria-hidden='true'></span></button>";
          allElementsData += "<a class='mvc-task-label-" + tasks[tasksCount].status + "'><input type='text' name='' value='"+tasks[tasksCount].taskName+"' disabled></a>";
          allElementsData += "<button type='button' name='button' class='icon-button'><span class='fa fa-times'  aria-hidden='true'></span></button>";
          allElementsData += "</div>";
        }
      }
      this.tasks_div.innerHTML = allElementsData;
    }
  },

  clearNewTaskInputText: function(owner, args){
    this.newTask_txt.value = '';
  },

  updateTasksCount: function(owner, args){
    var tasks = args.tasks;
    var uncompleteTasksCount = 0;
    for (var tasksCount = 0; tasksCount < tasks.length; tasksCount++) {
      if(tasks[tasksCount].status == 'uncomplete'){
        uncompleteTasksCount++;
      }
    }
    this.tasksCounter_txt.innerHTML = uncompleteTasksCount + " item left";
  },

  updateView: function(owner, args){
    this.resetViewButtons();
    switch(args.viewName){
      case('all'):{
          this.showAll_btn.classList.add("active-button");
        break;
      }
      case('uncomplete'):{
          this.showActive_btn.classList.add("active-button");
        break;
      }
      case('completed'):{
          this.showCompleted_btn.classList.add("active-button");
        break;
      }
    }
  },

  resetViewButtons: function(){
    this.showAll_btn.classList.remove("active-button");
    this.showActive_btn.classList.remove("active-button");
    this.showCompleted_btn.classList.remove("active-button");
  }
}
