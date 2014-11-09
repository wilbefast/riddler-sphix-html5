var speech = (function() {

	var _state = "uninitialised";
	var _recognition = null;
	var _draft_transcript = "";
 	var _full_transcript = "";

	function _init(settings)
	{
		_recognition = new webkitSpeechRecognition();
	  _recognition.continuous = true;
	  _recognition.interimResults = true;
	  _recognition.lang = settings.language;

	  _recognition.onstart = function() 
	  {
	    console.log("[speech] recognition started");

	    if(settings.onStart)
	    	settings.onStart();

	    _state = "running";
	  };

	  _recognition.onerror = function(event) 
	  {
	  	console.error("[speech] error", event.error);
	  };

	  _recognition.onend = function() 
	  {
	  	console.log("[speech] recognition end");

	  	if(_full_transcript != "")
	  		settings.onRecognised(_full_transcript);
	  	else if(_draft_transcript != "")
	  		settings.onRecognised(_draft_transcript);
	  	else
	  		settings.onRecognised(null);
	  	_full_transcript = "";
	  	_draft_transcript = "";

	  	_state = "ready";

	  	if(settings.onStop)
	  		settings.onStop();
	  };

	  _recognition.onresult = function(event) 
	  {
	    if (typeof(event.results) == 'undefined') 
	      return;

	    for (var i = event.resultIndex; i < event.results.length; ++i) 
	    {
	    	var transcript = event.results[i][0].transcript;

	      if (event.results[i].isFinal) 
	        _full_transcript += transcript;
	      else
	      	_draft_transcript += transcript;
	    }
	  };

	  _state = "ready";
	  settings.onReady();
	}

	function _start()
	{
		if(_state == "ready")
			_recognition.start();
		else
			console.warn("[speech] can't start, not ready");
	}

	function _stop()
	{
		if(_state == "running")
		{
			console.log("[speech] stopping recognition");
			_recognition.stop();
			_flushing = false;
			_state = "stopping";
		}
		else
			console.warn("[speech] can't stop, not running");
	}

	var _flushing = false;
	function _flushWithDelay(delay)
	{
		if(_flushing)
			return;
		_flushing = true;
		setTimeout(function()
		{
			_stop();
			_flushing = false;
		}, 1000*(delay || 0));
	}

	function _tryMatch(word)
	{
		if(_state == "running" || _state == "stopping")
		{
			return(_full_transcript.indexOf(word) > -1
				|| _draft_transcript.indexOf(word) > -1);
		}
		else
		{
			console.warn("[speech] can't match, not running");
			return false;
		}
	}

	return {
		init : _init,
		start : _start,
		stop : _stop,
		flushWithDelay : _flushWithDelay,
		tryMatch : _tryMatch
	}
})();