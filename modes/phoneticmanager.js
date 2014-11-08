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
      'd':["D"],
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
      'th':["TH", "DH"],
      'v':["V"],
      'w':["W"],
      'z':["Z", "ZH"]
    };
    
    var _phonems = [_vowels, _consonants];
    
    function getKeyFromPhonem(phonem)
    {
      for(var i in _consonants)
      {
        if(_consonants[i].indexOf(phonem)!=-1)
          return i;
      }
      for(var i in _vowels)
      {
        if(_vowels[i].indexOf(phonem)!=-1)
          return i;
      }
      return null;
    }

    return {
      evaluatePhonems:function(firstPhonem, secondPhonem)
      {
        
      },
    
      evaluatePhonetics:function(firstPhonetisedWord, secondPhonetisedWord)
      {
        
      },
    
      phonetize:function(text)
      {
      
        var request = new XMLHttpRequest();
        request.open("GET", "../dictionary?action=phonetize&text="+encodeURI(text), false);
        request.send(null);
        
        if(request.status === 200 || request.status == 0)
        {
            return JSON.parse(request.responseText);
        }
      },
      
      isVowel:function(phonem)
      {
        for(var key in _vowels)
        {
            if(_vowels[key].indexOf(phonem)!=-1)
                 return true;
        }
        return false;
      },
      
      isConsonant:function(phonem)
      {
        for(var key in _consonants)
        {
            if(_consonants[key].indexOf(phonem)!=-1)
                 return true;
        }
        return false;
      },
      
      getPhonemProximity:function(phonem1, phonem2)
      {
        var score = 0;
        if(this.isVowel(phonem1)&&this.isVowel(phonem2))
        {
          if(phonem1.match(/[A-Za-z]*/)[0]==phonem2.match(/[A-Za-z]*/)[0])
            return PERFECT;
          if(phonem1[0]==phonem2[0])
            return CLOSE;
          var key1 = getKeyFromPhonem(phonem1);
          var key2 = getKeyFromPhonem(phonem2);
          if(key1==key2)
            return CLOSE;
          if(key1>key2)
          {
            var tmp = key1;
            key1 = key2;
            key2 = tmp;
          }
          if(key1=='a')
          {
            if(key2=='e')
              return CLOSE;
            if(key2=='i')
              return AVERAGE;
            if(key2=='o')
              return AVERAGE;
            return FOREIGN;
          }
          if(key1=='e')
          {
            if(key2=='i')
              return CLOSE;
            if(key2=='o')
              return AVERAGE;
            return FOREIGN;
          }
          return FOREIGN;
        }
        else if(this.isConsonant(phonem1)&&this.isConsonant(phonem2))
        {
          var key1 = getKeyFromPhonem(phonem1);
          var key2 = getKeyFromPhonem(phonem2);
          if(key1==key2)
            return PERFECT;
          if((['p','b','d'].indexOf(key1)!=-1)&&(['p','b','d'].indexOf(key2)!=-1))
            return FOREIGN;
          if((['v','Z','th'].indexOf(key1)!=-1)&&(['v','z','th'].indexOf(key2)!=-1))
            return AVERAGE;
          if((['ch','sh'].indexOf(key1)!=-1)&&(['ch','sh'].indexOf(key2)!=-1))
            return AVERAGE;
          return NULL;
        }
        return score;
      },
      
      evaluateWordPhonemsStartingBy:function(phonems, length, wordPhonems)
      {
        var j = 0;
        var score = 0;
        var itLength = length;
        for(var i in phonems)
        {
          var malus = 0;
          var isPatternConsonant = this.isConsonant(phonems[i]);
          
          var isTargetConsonant;
          
          if(this.isConsonant(wordPhonems[j]))
            isTargetConsonant = true;
          else if(this.isVowel(wordPhonems[j]))
            isTargetConsonant = false;
        
          while((isPatternConsonant!=isTargetConsonant)&&(j<wordPhonems.length))
          {
            if(_consonants['h'].indexOf(wordPhonems[j])!=-1)
              malus+=0.5;
            else
              malus++;
            j++;
            
            if(this.isConsonant(wordPhonems[j]))
              isTargetConsonant = true;
            else if(this.isVowel(wordPhonems[j]))
              isTargetConsonant = false;
          }
          score+=(itLength--)*this.getPhonemProximity(phonems[i], wordPhonems[j])/(malus+1);
          j++;
        }
        return score/(length*(length+1)/2);
      },
      
      evaluateTextStartingBy:function(phonems, length, text)
      {
        var r = [0];
        var wordsArray = [];
        var score = 0;
        var nbWords = 0;
        var usedWords ={};
        var phonetized = this.phonetize(text);
        var splitText = text.split(' ');
        
        for(var i in phonetized)
        {
          var wordScore = 0;
          var wordPhonems = phonetized[i];
          for(var j in wordPhonems)
          {
            var phonetic = wordPhonems[j];
            wordScore = Math.max(wordScore, this.evaluateWordPhonemsStartingBy(phonems, length, phonetic));
          }
          if(wordScore>0)
          {
            var word = splitText[i];
            var nbUse = usedWords[word];
            if((nbUse!=undefined)&&(nbUse>1))
            {
              var pow2 = 2^nbUse;
              wordScore/=pow2;
              usedWords[word] = ++nbUse;
              nbWords+=1/(pow2);
            }
            else
            {
              usedWords[word] = 1;
              nbWords++;
            }
            score+=wordScore;
          }
          wordsArray.push([splitText[i],wordScore]);
        }
        
        var finalScore = (10-10/(nbWords/10+1))/10;
        r[0] = finalScore;
        for(var i in wordsArray)
        {
          r.push([wordsArray[i][0],finalScore*wordsArray[i][1]/nbWords,""]);
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