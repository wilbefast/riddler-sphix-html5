var ModeManager = (function () {
  var _instance;

  function init() {

    // Singleton

    var _modes = {};

    return {
      register: function (modeName, mode)
      {
        _modes[modeName] = mode;
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
