var EventDispatcher = function (owner){
  this._owner = owner;
  this._listeners = [];
}

EventDispatcher.prototype = {
  attach: function(listener){
    this._listeners.push(listener);
  },

  unattach: function(listener){
    // to be reviewed
    this._listeners.slice(listener, 1);
  },

  notify: function(args){
    for (var i = 0; i < this._listeners.length; i++) {
      this._listeners[i](this._owner, args);
    }
  }
}
