var ModeManager = (function () {
  var _instance;

  function init() {

    // Singleton

    var _modes = {};
    var _modesArray = [];


    return {
      register: function (mode)
      {
        _modes[mode.getName()] = mode;
      },
      getModes: function()
      {
        return _modes;
      },
      getRandomMode : function()
      {
        var k = Object.keys(_modes);
        return _modes[k[Math.floor(Math.random()*k.length)]]
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
