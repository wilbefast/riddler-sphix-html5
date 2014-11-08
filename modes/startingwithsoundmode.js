function StartingWithSoundMode(sounds, difficulty)
{
  this._sounds = sounds;
  this._difficulty = difficulty;
  
  this.getSounds = function()
  {
    return this._sounds;
  }
  
  this.getName = function(){ return "Words starting by "+"".concat(this._sounds); }
  
  this.getDifficulty = function(){ return this._difficulty; }
  
  this.getInstructions = function()
  {
    return "You have to use as much swearing as possible !\
Repeated words score less points";
  }
  
  this.process = function(text)
  {
    return PhoneticManager.getInstance().evaluateTextStartingBy(this._sounds,this._sounds.length,text);
  }
  

  ModeManager.getInstance().register(this);
}

new StartingWithSoundMode(["B"], 0.7);