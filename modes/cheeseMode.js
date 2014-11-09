ModeManager.getInstance().register((function () {

  var _cheeseList = {
    "Pecora" : 1.0,
    "Brebis" : 1.0,
    "Chevre" : 1.0,
    "Raclette" : 1.0,
    "Provolone" : 1.0,
    "Cantal" : 1.0,
    "Maroilles" : 1.0,
    "Morbier" : 1.0,
    "Montbrison" : 1.0,
    "Leicester" : 1.0,
    "Tilsit" : 1.0,
    "Caerphilly" : 1.0,
    "Windsor" : 1.0,
    "Stilton" : 1.0,
    "Gruyere" : 1.0,
    "Grana" : 1.0,
    "Halloumi" : 1.0,
    "Affinois" : 1.0,
    "Emmental" : 1.0,
    "Jarlsberger" : 1.0,
    "Liptauer" : 1.0,
    "Wensleydale" : 1.0,
    "Lancashire" : 1.0,
    "Stilton" : 1.0,
    "Gloucester" : 1.0,
    "Cheshire" : 1.0,
    "Blue" : 1.0,
    "Brie" : 1.0,
    "Roquefort" : 1.0,
    "Savoyard" : 1.0,
    "Boursin" : 1.0,
    "Camembert" : 1.0,
    "Gouda" : 1.0,
    "Edam" : 1.0,
    "Caithness" : 1.0,
    "Darby" : 1.0,
    "Wensleydale" : 1.0,
    "Feta" : 1.0,
    "Danbo" : 1.0,
    "Gorgonzola" : 1.0,
    "Parmesan" : 1.0,
    "Mozzarella" : 1.0,
    "Pippo" : 1.0,
    "Fimboe" : 1.0, 
    "Cheddar" : 1.0,
    "Illchester" : 1.0,
    "Cotswold" : 1.0,
    "Scarmoza" : 1.0
  }

  function _getName() {
    return "Cheese Mode";
  }

  function _getDifficult() {
    return 0.7;
  }

  function _getInstruction() {
    return "Name as many cheeses as you can, but try not to be too cheesy!";
  }

  function _getId() {
    return "cheese";
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
      var cheesiness = _cheeseList[word]

      if(cheesiness)
      {
        var timesUsed = (wordsTimesUsed[word] || 0);
        
        score = cheesiness / Math.pow(2, timesUsed);
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
      k = 1;
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