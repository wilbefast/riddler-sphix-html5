var ModeManager = (function () {
  var _instance;

  function init() {

    // Singleton

    var _modes = {};

    return {
      register: function (mode)
      {
        _modes[mode.getName()] = mode;
      },
      getModes: function()
      {
        return _modes;
      }
    };

  };

  return {
    getInstance: function ()
    {
      if ( !_instance )
      {
        _instance = init();
      }

      return _instance;
    }

  };

})();
