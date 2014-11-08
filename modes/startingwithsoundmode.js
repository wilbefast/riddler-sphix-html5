function StartingWithSoundMode(sounds, difficulty, soundName)
{
  this._sounds = sounds;
  this._difficulty = difficulty;
  this._soundName = soundName;
  
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

  this.getId = function()
  {
    return "start_sound_" + this._soundName;
  }
  

  ModeManager.getInstance().register(this);
}

new StartingWithSoundMode(["IH", "N"], 0.7, "in");
new StartingWithSoundMode(["AA", "N"], 0.7, "an");
new StartingWithSoundMode(["DH"], 0.7, "th");
new StartingWithSoundMode(["HH", "EH"], 0.7, "he");