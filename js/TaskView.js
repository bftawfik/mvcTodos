var TaskView = function(model){
  this._model = model;

  this.addNewTaskEvent = new EventDispatcher(this);
  this.markAllAsEvent = new EventDispatcher(this);
  this.switchViewEvent = new EventDispatcher(this);
  this.changeTaskStatusEvent = new EventDispatcher(this);
  this.removeTaskEvent = new EventDispatcher(this);
  this.removeCompletedTasksEvent = new EventDispatcher(this);

  this.init()

}

TaskView.prototype = {
  init: function(){
    this.addElements()
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

  addEventHandelers: function(){
    this.markAllAs_btn.addEventListener('click', this.markAllAsHandler.bind(this));
    this.newTask_txt.addEventListener('keyup', this.addNewTaskHandler.bind(this));

    this.tasks_div.addEventListener('click', this.tasksDivHandler.bind(this));

    this.showAll_btn.addEventListener('click', this.showAllHandler.bind(this));
    this.showActive_btn.addEventListener('click', this.showActiveHandler.bind(this));
    this.showCompleted_btn.addEventListener('click', this.showCompletedHandler.bind(this));
    this.clearCompleted_btn.addEventListener('click', this.clearCompletedHandler.bind(this));

    return this;
  },

  connectToModel: function(){
    this._model.tasksUpdatedEvent.attach(this.updateTasksDiv.bind(this));
    this._model.tasksUpdatedEvent.attach(this.clearNewTaskInputText.bind(this));
    this._model.tasksUpdatedEvent.attach(this.updateTasksCount.bind(this));
    this._model.viewSwitchedEvent.attach(this.updateView.bind(this));
  },
  //---------------------------------------------------------------------------
  markAllAsHandler: function(){
    this.markAllAsEvent.notify();
  },

  addNewTaskHandler: function(e){
    if (e.keyCode == 13) {
      this.addNewTaskEvent.notify({taskName: this.newTask_txt.value});
    }
  },

  tasksDivHandler: function(e){
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

  showAllHandler: function(){
    this.switchViewEvent.notify({viewName: "all"});
  },

  showActiveHandler: function(){
    this.switchViewEvent.notify({viewName: "uncomplete"});
  },

  showCompletedHandler: function(){
    this.switchViewEvent.notify({viewName: "completed"});
  },

  clearCompletedHandler: function(){
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
          allElementsData += "<a class='mvc-task-label-" + tasks[tasksCount].status + "'><input type='text' name='' value="+tasks[tasksCount].taskName+" disabled></a>";
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
