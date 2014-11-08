var game = (function() {

	var _state = "uninitialised";

	var _speech;
	var _display;

	var _phase = (function(){

		var _tmp = {};
		var _all = {};
		var _current = null;
		
		function _change(next) {
			var next = _all[next];
			if(!next || (_current == next))
			{
				console.error("[game] phase does not exist", _phase);
				return;
			}
			if(_current)
				_current.onLeave(next);
			next.onEnter(_current);
			_tmp = {};
			_current = next;
			//_display.setPhase(next);
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
      		_change("rap"); // FIXME
      	else
      	{
      		_speech.start();
					_speech.flushWithDelay(3);
      	}
			}
		}

		var _ready = {
			onEnter : function(previous) {
			},
			onLeave : function(next) {
			},
		}

		var _rules = {
			onEnter : function(previous) {
			},
			onLeave : function(next) {
			},
		}

		var _rap = {
			onEnter : function(previous) {
				_speech.start();
				_speech.flushWithDelay(10);
			},
			onLeave : function(next) {
			},
			onText : function(text) {
        var words = text.split(" ");
        for(var i in words)
          _display.addWord(words[i]);

				_speech.start();
				_speech.flushWithDelay(10);
			}
		}

		var _review = {
			onEnter : function(previous) {
			},
			onLeave : function(next) {
			},
		}

		var _handover = {
			onEnter : function(previous) {
			},
			onLeave : function(next) {
			},
		}

		_all["title"] = _title;
		_all["ready"] = _ready;
		_all["rules"] = _rules;
		_all["rap"] = _rap;
		_all["review"] = _review;
		_all["handover"] = _handover;

		function _onText(text) {
			if(_current.onText)
				_current.onText(text);
		}

		return {
			changeTo : _change,
			onText : _onText
		}
	})();

	function _init(settings)
	{
		_speech = settings.speech;
		_display = settings.display;

		var n_modules_to_load = 1;
		function onModuleLoaded(m)
		{
			console.log("[game] module finished loading:", m)
			if(--n_modules_to_load <= 0)
			{
				console.log("[game] all modules loaded");
				_phase.changeTo("title");
			}
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

