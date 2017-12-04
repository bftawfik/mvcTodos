var TaskController = function (model, view){
  this._model = model;
  this._view = view;

  this.init();
}

TaskController.prototype = {
  init: function(){
    this.addElementsControllers();
  },

  addElementsControllers: function(){
    this._view.addNewTaskEvent.attach(this.addNewTaskController.bind(this));
    this._view.markAllAsEvent.attach(this.markAllAsController.bind(this));
    this._view.switchViewEvent.attach(this.switchViewController.bind(this));
    this._view.changeTaskStatusEvent.attach(this.changeTaskStatusController.bind(this));
    this._view.removeTaskEvent.attach(this.removeTaskController.bind(this));
    this._view.removeCompletedTasksEvent.attach(this.removeCompletedTasksController.bind(this));
  },

  addNewTaskController: function(owner, args){
    this._model.addNewTask(args.taskName);
  },

  markAllAsController: function(owner, args){
    this._model.markAllAs(args);
  },

  switchViewController: function(owner, args){
    this._model.switchView(args.viewName);
  },

  changeTaskStatusController: function(owner, args){
    this._model.changeTaskStatus(args.taskId);
  },

  removeTaskController: function(owner, args){
    this._model.removeTask(args.taskId);
  },

  removeCompletedTasksController: function(owner, args){
    this._model.removeCompletedTasks(args);
  },
}
