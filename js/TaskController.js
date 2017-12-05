var TaskController = function (model, view){
  this._model = model;
  this._view = view;

  this.init();
}

TaskController.prototype = {
  init: function(){
    this.makeElementsControllers()
    .addElementsControllers();
  },

  makeElementsControllers: function(){
    this.addNewTaskController = this.addNewTask.bind(this);
    this.markAllAsController = this.markAllAs.bind(this);
    this.switchViewController = this.switchView.bind(this);
    this.changeTaskStatusController = this.changeTaskStatus.bind(this);
    this.changeTaskNameController = this.changeTaskName.bind(this);
    this.removeTaskController = this.removeTask.bind(this);
    this.removeCompletedTasksController = this.removeCompletedTasks.bind(this);

    return this;
  },

  addElementsControllers: function(){
    this._view.addNewTaskEvent.attach(this.addNewTaskController);
    this._view.markAllAsEvent.attach(this.markAllAsController);
    this._view.switchViewEvent.attach(this.switchViewController);
    this._view.changeTaskStatusEvent.attach(this.changeTaskStatusController);
    this._view.changeTaskNameEvent.attach(this.changeTaskNameController);
    this._view.removeTaskEvent.attach(this.removeTaskController);
    this._view.removeCompletedTasksEvent.attach(this.removeCompletedTasksController);
  },

  addNewTask: function(owner, args){
    this._model.addNewTask(args.taskName);
  },

  markAllAs: function(owner, args){
    this._model.markAllAs(args);
  },

  switchView: function(owner, args){
    this._model.switchView(args.viewName);
  },

  changeTaskStatus: function(owner, args){
    this._model.changeTaskStatus(args.taskId);
  },

  changeTaskName: function(owner, args){
    this._model.changeTaskName(args);
  },

  removeTask: function(owner, args){
    this._model.removeTask(args.taskId);
  },

  removeCompletedTasks: function(owner, args){
    this._model.removeCompletedTasks(args);
  },
}
