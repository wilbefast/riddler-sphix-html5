var SwearMode = (function () {
  var _instance;

  function init() {

    // Singleton

    var _modes = {};

    return {
      getName:function(){ return "Swear Mode"; },
      getDifficulty: function(){ return 0.4; },
      getInstructions: function()
      {
        return "You have to use as much swearing as possible !\
Repeated words score less points";
      },
      process: function(text)
      {
        var words = text.split(/[\s|,]+/);
        var swearwords = [];
        for(var i=0; i < words.length; i++)
        {
          if(words[i].indexOf('*')!=-1)
            swearwords.push(words[i]);
        }
        var result = [0];
        var swearwordsScore = [];
        
        swearCount = 0;
        for(var i in swearwords)
        {
          var word = swearwords[i];
          var idx = (i==0?-1:swearwords.lastIndexOf(word, i-1));
          if(idx==-1)
          {
            swearwordsScore.push([word, 1]);
            swearCount++;
          }
          else
          {
            var score = swearwordsScore[idx][1]/2;
            swearwordsScore.push([word, score]);
            swearCount+=score;
          }
        }
        var finalScore = (10-10/(swearCount/10+1))/10;
        result[0]=finalScore;
        var swearIndex = 0;
        for(var i in words)
        {
          var word = words[i];
          var item = [word, 0, ""];
          if(swearwords[swearIndex]==word)
          {
            item[1] = finalScore*swearwordsScore[swearIndex++][1]/swearCount;
          }
          result.push(item);
        }
        return result;
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

//ModeManager.getInstance().register(SwearMode.getInstance());