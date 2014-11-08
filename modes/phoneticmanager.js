var PhoneticManager = (function () {
  var _instance;

  function init() {

    // Singleton
    var PERFECT = 1;
    var CLOSE = 0.8;
    var AVERAGE = 0.5;
    var FOREIGN = 0.2;
    var NULL = 0;

    var _vowels = {
      'a':["AA", "AA0", "AA1", "AA2", "AE", "AE0", "AE1", "AE2", "AH", "AH0", "AH1", "AH2", "AO", "AO0", "AO1", "AO2", "AW", "AW0", "AW1", "AW2", "AY", "AY0", "AY1", "AY2"],
      'e':["EH", "EH0", "EH1", "EH2", "ER", "ER0", "ER1", "ER2", "EY", "EY0", "EY1", "EY2"],
      'i':["IH", "IH0", "IH1", "IH2", "IY", "IY0", "IY1", "IY2", "Y"],
      'o':["OW", "OW0", "OW1", "OW2", "OY", "OY0", "OY1", "OY2"],
      'u':["UH", "UH0", "UH1", "UH2", "UW", "UW0", "UW1", "UW2"]
    };

    var _consonants = {
      'b':["B"],
      'c':["K"],
      'ch':["CH"],
      'd':["D", "DH"],
      'f':["F"],
      'g':["G"],
      'h':["HH"],
      'j':["JH"],
      'k':["K"],
      'l':["L"],
      'm':["M"],
      'n':["N", "NG"],
      'p':["P"],
      'r':["R"],
      's':["S"],
      'sh':["SH"],
      't':["T"],
      'th':["TH"],
      'v':["V"],
      'w':["W"],
      'z':["Z", "ZH"]
    };
    
    var _phonems = [_vowels, _consonants];
    
    var _phoneticDictionary = {};
    
    var loadPhoneticDictionnary = function()
    {
      var phoneticDico = readTextFile('./data/phonetic_dico.txt');
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
    }();

    return {
      evaluatePhonems:function(firstPhonem, secondPhonem)
      {
        
      },
    
      evaluatePhonetics:function(firstPhonetisedWord, secondPhonetisedWord)
      {
        
      },
    
      phonetize:function(text)
      {
        var r = [];
        var words = text.split(' ');
        for(var i in words)
        {
          console.log(words[i]);
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
