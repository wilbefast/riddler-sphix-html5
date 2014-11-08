var game = (function() {

	var _state = "uninitialised";

	var _speech;
	var _display;
	var _modemanager;
	var _music;

	var _score = 0.5;
	var _round = 0;
	var _player = 0;

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
			_tmp = {};
			next.onEnter(prev);

			_display.setState(next_name);
		}

		var _title = {
			onEnter : function(previous) {
				_score = 0.5;
				_round = 0;
				_player = 0;
				_speech.start();
				_speech.flushWithDelay(3);
				_music.menu.play();
			},
			onLeave : function(next) {
				_music.menu.pause();
				_music.scratch.play();
			},
			onText : function(text) {
      	if(text && text.indexOf("rap battle") > -1)
      	{
      		_change("rules");
      	}
      	else
      	{
      		_speech.start();
					_speech.flushWithDelay(3);
      	}
			}
		}

		var _rules = {
			onEnter : function(previous) {
				_tmp.t = 0;
				_music.drums.play();
			},
			update : function(dt) {
				_tmp.t += dt;
				if(_tmp.t > 5)
					_change("rap");
			},
			onLeave : function(next) {
				_music.drums.pause();
				_music.scratch.play();
			},
		}

		var _rap = {
			onEnter : function(previous) {
				_speech.start();
				_speech.flushWithDelay(10);
				_tmp.mode = _modemanager.getRandomMode();
				_music.rap[_round].play();
			},
			onLeave : function(next) {
				_music.rap[_round].pause();
				_music.scratch.play();
			},
			onText : function(text) {
				if(text)
				{
					var wordScores = _tmp.mode.process(text);
					console.log(wordScores);

					_change("review");
					_display.addWordsWithScore(JSON.stringify(wordScores));

					var total_score = 0;
					for(var i in wordScores)
						total_score += wordScores[i][1]; 

					_score -= (_player*2 - 1)*total_score/3;
					if(_score < 0) score = 0;
					if(_score > 1) score = 1;
					//_display.setScore(_score);
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
				if(_tmp.t > 10)
				{
					_player++;
					if(_player >= 2)
					{
						_player = 0
						_round++;
					}
					if(_round >= 3)
						_change("gameover");
					else
						_change("handover");
				}
			},
			onLeave : function(next) {
				_music.review[_tmp.prev_round].pause();
				_music.scratch.play();
				/*_display.setRound(_round);
				_display.setPlayer(_player);*/
			}
		}

		var _handover = {
			onEnter : function(previous) {
				_speech.start();
				_speech.flushWithDelay(3);
				_music.drums.play();
			},
			onLeave : function(next) {
				_music.scratch.play();
			},
			onText : function(text) {
      	if(text && text.indexOf("ready") > -1)
      	{
      		_change("rules");
      	}
      	else
      	{
      		_speech.start();
					_speech.flushWithDelay(3);
      	}
			}
		}

		var _gameover = {
			onEnter : function(previous) {
				_tmp.t = 0;
			},
			update : function(dt) {
				_tmp.t += dt;
				if(_tmp.t > 8)
					_change("title");
			},
		}

		_all["title"] = _title;
		_all["rules"] = _rules;
		_all["rap"] = _rap;
		_all["review"] = _review;
		_all["handover"] = _handover;
		_all["gameover"] = _gameover;

		function _onText(text) {
			if(_current.onText)
				_current.onText(text);
		}

		function _update(dt) {
			if(_current.update)
				_current.update(dt);
		}

		return {
			changeTo : _change,
			onText : _onText,
			update : _update
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
      }
    });


		_state = "ready";
	}

	return {
		init : _init,

	}
})();

