var game = (function() {

	var _state = "uninitialised";

	var _speech;
	var _display;
	var _modemanager;
	var _music;
	var _sound;
	var _score;
	var _latest_score_delta = 0;
	var _skip_review = false;
	var _round = 0;
	var _player = 0;
	var _mode = null;

	var _phase = (function(){

		var _tmp = {};
		var _all = {};
		var _current = null;
		
		function _change(next_name) {
			var next = _all[next_name];
			if(!next || (_current == next))
			{
				console.error("[game] phase does not exist", _phase);
				return;
			}
			console.log("[game] --- switching to phase " + next_name + " ---");
			var prev = _current;
			_current = next;
			if(prev)
				prev.onLeave(next);
			_speech.stop();
			_tmp = {};
			next.onEnter(prev);

			_display.setState(next_name);
		}

		var _title = {
			onEnter : function(previous) {
				_score = [ 0, 0 ];
				_round = 0;
				_player = 0;
				_speech.start();
				_music.menu.play();
				_display.setRound(1);
				_display.setPlayer(0);
				_tmp.t = 0;
			},
			onLeave : function(next) {
				_music.menu.pause();
				_sound.scratch.play();
			},
			onText : function(text) {
      	if(text && text.indexOf("rap battle") > -1)
      	{
      		_change("rules");
      	}
      	else if(text && text.indexOf("credits") > -1)
      	{
      		_change("gameCredits");
      	}
			},
			update : function(dt)  {
				_tmp.t += dt;
				if(_tmp.t > 0.5)
				{
					if(_speech.tryMatch("rap battle"))
						_change("rules");
					else if(_speech.tryMatch("credits"))
						_change("gameCredits"); 
					_tmp.t = 0;
				}
			},
			onSpeechStop : function() {
				_speech.start();
			}
		}

		var _rules = {
			onEnter : function(previous) {
				_tmp.t = 0;
				_mode = _modemanager.getRandomMode();
				console.log("[game] === using mode " + _mode.getId() + " ===");
				_display.setRule(_mode.getId());
				_music.drums.play();
				_display.setRound(_round + 1);
				_display.setPlayer(_player);
			},
			update : function(dt) {
				_tmp.t += dt;
				if(_tmp.t > 5)
					_change("rap");
			},
			onLeave : function(next) {
				_music.drums.pause();
				_sound.scratch.play();
			},
		}

		var _rap = {
			onEnter : function(previous) {
				_speech.start();
				_speech.flushWithDelay(10);

				_music.rap[_round].play();
			},
			onLeave : function(next) {
				_music.rap[_round].pause();
				_sound.scratch.play();
			},
			onText : function(text) {
				if(text)
				{
					_skip_review = false;

					var wordScores = _mode.process(text);
					_latest_score_delta = wordScores[0]/3;
					console.log("[game] score delta =", _latest_score_delta);
					for(var i = 1; i < wordScores.length; i++)
						console.log("\t...", wordScores[i][0], wordScores[i][1]);

					_change("review");
					_display.addWordsWithScore(JSON.stringify(wordScores));

					_score[_player] += _latest_score_delta;
					_display.setScore(JSON.stringify(_score));
	      }
	      else
	      {
	      	_skip_review = true;

	      	_latest_score_delta = 0;
	      	_change("review");
	      }
			}
		}

		var _review = {
			onEnter : function(previous) {
				_tmp.t = 0;
				_tmp.prev_round = _round;
				_music.review[_tmp.prev_round].play();
			},
			update : function(dt) {
				_tmp.t += dt;
				if((_tmp.t > 14) || _skip_review)
				{
					_player++;
					if(_player >= 2)
					{
						_player = 0
						_round++;
					}
					console.log("[game] player is " + _player + " round is " + _round);
					if(_round >= 3)
					{
						_change("gameOver");
						_display.setScore(JSON.stringify(_score));
					}
					else
						_change("handOver");
				}
			},
			onLeave : function(next) {
				_music.review[_tmp.prev_round].pause();
				_sound.scratch.play();
				_display.setRound(_round + 1);
				_display.setPlayer(_player);
			}
		}

		var _handOver = {
			onEnter : function(previous) {
				_speech.start();
				_music.drums.play();
				_tmp.t = 0;
			},
			onLeave : function(next) {
				_sound.scratch.play();
				_music.drums.pause();
			},
			onText : function(text) {
      	if(text && text.indexOf("ready") > -1)
      		_change("rules");
			},
			update : function(dt)  {
				_tmp.t += dt;
				if(_tmp.t > 0.5)
				{
					if(_speech.tryMatch("ready"))
						_change("rules");
					_tmp.t = 0;
				}
			},
			onSpeechStop : function() {
				_speech.start();
			}
		}

		var _gameOver = {
			onEnter : function(previous) {
				_speech.start();
				_tmp.t = 0;
				_music.menu.play();
			},
			onLeave : function(next) {
				_music.menu.pause();
				_sound.scratch.play();
			},
			update : function(dt)  {

				_tmp.t += dt;
				if(_tmp.t > 0.5)
				{
					if(_speech.tryMatch("menu"))
						_change("title");
					_tmp.t = 0;
				}
			},
			onText : function(text) {
      	if(text && text.indexOf("menu") > -1)
      		_change("menu");
			},
			onSpeechStop : function() {
				_speech.start();
			}
		}

		var _gameCredits = {
			onEnter : function(previous) {
				_speech.start();
				_music.menu.play();
				_tmp.t = 0;
			},
			onLeave : function(next) {
				_music.menu.pause();
				_sound.scratch.play();
			},
			onText : function(text) {
      	if(text && text.indexOf("menu") > -1)
      		_change("title");
			},
			update : function(dt)  {
				_tmp.t += dt;
				if(_tmp.t > 0.5)
				{
					if(_speech.tryMatch("menu"))
						_change("title");
					_tmp.t = 0;
				}
			},
			onSpeechStop : function() {
				_speech.start();
			}
		}

		_all["title"] = _title;
		_all["rules"] = _rules;
		_all["rap"] = _rap;
		_all["review"] = _review;
		_all["handOver"] = _handOver;
		_all["gameOver"] = _gameOver;
		_all["gameCredits"] = _gameCredits;

		function _onText(text) {
			if(_current.onText)
				_current.onText(text);
		}

		function _update(dt) {
			if(_current.update)
				_current.update(dt);
		}

		function _onSpeechStop() {
			if(_current.onSpeechStop)
				_current.onSpeechStop();
		}

		return {
			changeTo : _change,
			onText : _onText,
			update : _update,
			onSpeechStop : _onSpeechStop
		}
	})();

	function _update(dt)
	{
		_phase.update(dt);
	}

	function _init(settings)
	{
		_speech = settings.speech;
		_display = settings.display;
		_modemanager = settings.modemanager;
		_music = settings.music;
		_sound = settings.sound;

		var n_modules_to_load = 2;
		function onModuleLoaded(m)
		{
			console.log("[game] module finished loading:", m)
			if(--n_modules_to_load <= 0)
			{
				_phase.changeTo("title");

				var prev_t = (new Date()).getTime();
				setInterval(function(){
					var curr_t = (new Date()).getTime();
					_update((curr_t - prev_t)/1000);
					prev_t = curr_t;
				}, 1000/60);
			}
		}

    window.SWFLoaded = function()
    {
      onModuleLoaded("display");
    }

    _speech.init({
      language : "en-GB",
      onRecognised : function(text) {
      	_phase.onText(text);
      	if(text)
        	console.log("[game] recognised:", text);
        else
        	console.log("[game] nothing recognised this time");
      },
      onReady : function() {
      	onModuleLoaded("speech");
      },
      onStop : function() {
      	_phase.onSpeechStop();
      }
    });


		_state = "ready";
	}

	return {
		init : _init,

	}
})();

