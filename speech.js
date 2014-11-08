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

	    settings.onStart();
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
	  	_full_transcript = "";
	  	_draft_transcript = "";

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
		_recognition.start();
	}

	function _stop()
	{
		console.log("[speech] stopping recognition");
		
		_recognition.stop();
	}


	return {
		init : _init,
		start : _start,
		stop : _stop

	}
})();