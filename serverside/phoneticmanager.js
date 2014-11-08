var utils = require('./utils.js');

var PhoneticManager = (function () {
  var _instance;

  function init() {    
    var _phoneticDictionary = {};
    
    var loadPhoneticDictionnary = function()
    {
      var phoneticDico = utils.readTextFile('./serverside/data/phonetic_dico.txt');
      var firstChar = phoneticDico.indexOf('\nA ')+1;
      var lastChar = phoneticDico.lastIndexOf('\n{BRACE');
      phoneticDico = phoneticDico.slice(firstChar, lastChar);
      phoneticDico = phoneticDico.split('\n');
      for(var i in phoneticDico)
      {
        var currentLine = phoneticDico[i];
        var split = currentLine.split(/ (.+)?/);
        var key = split[0];
        var value;
        if(key.match(/\(\d+\)$/))
        {
          key = key.split(/\(\d+\)$/)[0];
          value = _phoneticDictionary[key];
          value.push(split[1].trim().split(' '));
        }
        else
          value = [split[1].trim().split(' ')];
        _phoneticDictionary[key] = value;
      }
      console.log("Dictionary Loaded");
    }();

    return {    
      phonetize:function(text)
      {
        var r = [];
        var words = text.split(' ');
        for(var i in words)
        {
          r.push(_phoneticDictionary[words[i].toUpperCase()]);
        }
        return r;
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

module.exports = {
  PhoneticManager: PhoneticManager
}