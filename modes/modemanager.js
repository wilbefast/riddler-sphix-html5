var ModeManager = (function () {
  var _instance;

  function init() {

    // Singleton

    var _modes = {};
    var _modesArray = [];
    var _usedModesStack = [];

    return {
      register: function (mode)
      {
        _usedModesStack.splice(Math.random()*(Object.keys(_usedModesStack).length+1),0,mode);
        _modes[mode.getName()] = mode;
      },
      getModes: function()
      {
        return _modes;
      },
      getRandomMode : function()
      {
        var keys = Object.keys(_modes);
        var length = keys.length;
        var rnd = Math.random()*(length*(length-1)/2);
        for(i in keys)
        {
          rnd-=(length-i-1);
          if(rnd<0)
            break;
        }
        var chosenMode = _usedModesStack[i];
        var prevIndex = _usedModesStack.indexOf(chosenMode);
        if(prevIndex!=-1)
          _usedModesStack.splice(prevIndex,1);
        _usedModesStack.push(chosenMode);
        return chosenMode;
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
