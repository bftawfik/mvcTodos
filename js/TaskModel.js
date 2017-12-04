var TaskModel = function (){
  this._tasks = [];
  this._currentView = "all";

  this.tasksUpdatedEvent = new EventDispatcher(this);
  this.viewSwitchedEvent = new EventDispatcher(this);
}

TaskModel.prototype = {
  addNewTask: function(taskName){
    this._tasks.push({taskName: taskName, status: 'uncomplete'});
    this.tasksUpdatedEvent.notify({tasks: this._tasks, currentView: this._currentView});
  },

  markAllAs: function(args){
    var tasksStatus = "uncomplete";
    for (var taskCount = 0; taskCount < this._tasks.length; taskCount++) {
      if (this._tasks[taskCount].status == "uncomplete") {
        tasksStatus = "completed";
        break;
      }
    }
    for (var taskCount = 0; taskCount < this._tasks.length; taskCount++) {
      this._tasks[taskCount].status = tasksStatus;
    }
    this.tasksUpdatedEvent.notify({tasks: this._tasks, currentView: this._currentView});
  },

  switchView: function(viewName){
    this._currentView = viewName;
    this.viewSwitchedEvent.notify({viewName: viewName});
    this.tasksUpdatedEvent.notify({tasks: this._tasks, currentView: this._currentView});
  },

  changeTaskStatus: function(taskId){
    if(this._tasks[taskId].status == "uncomplete"){
      this._tasks[taskId].status = "completed";
    }else{
      this._tasks[taskId].status = "uncomplete";
    }
    this.tasksUpdatedEvent.notify({tasks: this._tasks, currentView: this._currentView});
  },

  removeTask: function(taskId){
    this._tasks.splice(taskId, 1);
    this.tasksUpdatedEvent.notify({tasks: this._tasks, currentView: this._currentView});
  },

  removeCompletedTasks: function(){
    for (var taskCount = this._tasks.length-1; taskCount >= 0; taskCount--) {
      if(this._tasks[taskCount].status == "completed"){
        this._tasks.splice(taskCount, 1);
      }
    }
    this.tasksUpdatedEvent.notify({tasks: this._tasks, currentView: this._currentView});
  },

  getTasks: function(){
    return this._tasks;
  },
}
