
(function(){
  this._model = new TaskModel();
  this._view = new TaskView(this._model);
  this._controller = new TaskController(this._model, this._view);
})();
