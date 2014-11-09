ModeManager.getInstance().register((function () {

  var _dictionary = {
    "Chicken" : 1.0,
    "Cow" : 1.0,
    "Bull" : 1.0,
    "Dog" : 1.0,
    "Donkey" : 1.0,
    "Goat" : 1.0,
    "Goose" : 1.0,
    "Horse" : 1.0,
    "Pig" : 1.0,
    "Rooster" : 1.0,
    "Sheep" : 1.0,
    "Turkey" : 1.0

  }

  function _getName() {
    return "Farm Animal Mode";
  }

  function _getDifficult() {
    return 0.3;
  }

  function _getInstruction() {
    return "Name as many farm animals as you can!";
  }

  function _getId() {
    return "animals_farm";
  }

  function _process(text) {

    function firstUpper(word)
    {
        return word.charAt(0).toUpperCase() + word.toLowerCase().slice(1);
    }

    var words = text.split(/[\s|,]+/);
    var wordsTimesUsed = {}
    var total_score = 0;
    var result = [ 0 ];

    // get initial score for each cheese word
    for(var i=0; i < words.length; i++)
    {
      var word = firstUpper(words[i]);
      var score;
      var multiplier = _dictionary[word]

      if(multiplier)
      {
        var timesUsed = (wordsTimesUsed[word] || 0);
        
        score = multiplier / Math.pow(2, timesUsed);
        total_score += score; 

        wordsTimesUsed[word] = timesUsed + 1;
      }
      else
        score = 0;

      result.push([word, score, ""]);
    }

    // normalise the scores
    var normed_total_score = (3-3/(total_score/3+1))/3;
    
    var k;
    if(total_score!=0)
      k = normed_total_score/total_score;
    else
      k=1;
    for(var i = 1; i < result.length; i++)
      result[i][1] *= k;

    // add the total score to the result
    result[0] = normed_total_score;

    return result;
  }

  return {
    getName : _getName,
    getId : _getId,
    getInstruction : _getInstruction,
    getDifficult : _getDifficult,
    process : _process
  }

})());