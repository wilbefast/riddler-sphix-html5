var game = (function() {

	var _state = "uninitialised";

	var _speech;
	var _display;
	var _modemanager;

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
			if(_current)
				_current.onLeave(next);
			_tmp = {};
			next.onEnter(_current);
			_current = next;

			_display.setState(next_name);
		}

		var _title = {
			onEnter : function(previous) {
				_speech.start();
				_speech.flushWithDelay(3);
			},
			onLeave : function(next) {
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
			},
			update : function(dt) {
				_tmp.t += dt;
				if(_tmp.t > 5)
					_change("rap");
			},
			onLeave : function(next) {
			},
		}

		var _rap = {
			onEnter : function(previous) {
				_speech.start();
				_speech.flushWithDelay(10);
				_tmp.mode = _modemanager.getRandomMode();
			},
			onLeave : function(next) {
			},
			onText : function(text) {
				if(text)
				{
					console.log(_tmp.mode.process(text));
					_display.addWordsWithScore(JSON.stringify(_tmp.mode.process(text)));
	       	//_change("review");
	        
	      }
			}
		}

		var _review = {
			onEnter : function(previous) {
				_tmp.t = 0;
			},
			update : function(dt) {
				_tmp.t += dt;
				if(_tmp.t > 10)
					_change("handover");
			},
			onLeave : function(next) {
			}
		}

		var _handover = {
			onEnter : function(previous) {
				_speech.start();
				_speech.flushWithDelay(3);
			},
			onLeave : function(next) {
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

		_all["title"] = _title;
		_all["rules"] = _rules;
		_all["rap"] = _rap;
		_all["review"] = _review;
		_all["handover"] = _handover;

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

		var n_modules_to_load = 2;
		function onModuleLoaded(m)
		{
			console.log("[game] module finished loading:", m)
			if(--n_modules_to_load <= 0)
			{
				console.log("[game] all modules loaded");
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

