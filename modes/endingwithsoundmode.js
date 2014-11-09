function EndingWithSoundMode(sounds, difficulty, soundName)
{
  this._sounds = sounds;
  this._difficulty = difficulty;
  this._soundName = soundName;
  
  this.getSounds = function()
  {
    return this._sounds;
  }
  
  this.getName = function(){ return "Words ending by "+"".concat(this._sounds); }
  
  this.getDifficulty = function(){ return this._difficulty; }
  
  this.getInstructions = function()
  {
    return "You have to use as much swearing as possible !\
Repeated words score less points";
  }
  
  this.process = function(text)
  {
    return PhoneticManager.getInstance().evaluateTextEndingBy(this._sounds,this._sounds.length,text);
  }

  this.getId = function()
  {
    return "rhyme_" + this._soundName;
  }

  ModeManager.getInstance().register(this);
}

new EndingWithSoundMode(["EY"], 0.7, "ay");
new EndingWithSoundMode(["IH", "L"], 0.7, "ill");
new EndingWithSoundMode(["AA","T"], 0.7, "ot");