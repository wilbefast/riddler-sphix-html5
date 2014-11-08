ModeManager.getInstance().register((function () {

  var _cheeseList = {
    "Red Leicester", 
    "Tilsit", 
    "Caerphilly", 
    "Bel Paese", 
    "Red Windsor", 
    "Stilton", 
    "Gruyere", 
    "Emmental", 
    "Jarlsberger", 
    "Liptauer", 
    "Lancashire", 
    "White Stilton", 
    "Blue",
    "Danish Blue", 
    "Double Gloucester", 
    "Cheshire", 
    "Blue Vinney", 
    "Brie", 
    "Roquefort", 
    "Pont l'Eveque", 
    "Port Salut", 
    "Savoyard", 
    "Saint Paulin", 
    "Carre de L'Est",
    "Boursin", 
    "Bresse Bleu", 
    "Perle de Champagne", 
    "Camembert",
    "Gouda", 
    "Edam", 
    "Caithness",
    "Smoked Austrian",
    "Japanese Sage Darby",
    "Wensleydale", 
    "Greek Feta", 
    "Gorgonzola", 
    "Parmesan", 
    "Mozzarella", 
    "Pippo Creme", 
    "Danish Fimboe",  
    "Cheddar", 
    "Illchester"
  }

  function _getName() {
    return "Cheese Mode";
  }

  function _getDifficult() {
    return 0.7;
  }

  function _getInstruction() {
    return "Name as many cheeses as you can, but try not to be too cheesy!"
  }

  function _getId() {
    return "cheese";
  }

  function _process() {
    var words = text.split(/[\s|,]+/);
    var wordsTimesUsed = {}
    var total_score = 0;
    var result = [ 0 ];

    // get initial score for each cheese word
    for(var i=0; i < words.length; i++)
    {
      var word = words[i];
      var score;

      if(_cheeseList[word])
      {
        var timesUsed = (wordsTimesUsed[word] or 0);
        
        score = 1 / (2 ^ timesUsed);
        total_score += score; 

        wordsTimesUsed[word] = timesUsed + 1;
      }
      else
        score = 0;

      result.push([word, score, ""]);
    }

    // normalise the scores
    var normed_total_score = (10-10/(total_score/10+1))/10;
    var k = normed_total_score/total_score;
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