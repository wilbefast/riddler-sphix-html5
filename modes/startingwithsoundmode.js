var StartingWithSoundMode = function (sound)
{
  _sound = sound;
  getSound = function()
  {
    return _sound;
  }
}