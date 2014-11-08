package
{
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.FocusEvent;
	import flash.events.KeyboardEvent;
	import flash.net.SharedObject;
	import flash.text.TextField;
	import flash.text.TextFieldType;
	import flash.text.TextFormat;
	import flash.ui.Keyboard;
	import flash.utils.Dictionary;

	public class CoolConsole extends Sprite
	{
		private var _inputField:TextField;
		private var _openKey:int;
		private var _executeKey:int;
		private var _prevHistoryKey:int;
		private var _nextHistoryKey:int;
		private var _commandHistory:Array;
		private var _historyMax:Number;
		private var _showing:Boolean;
		private var _currHistoryIndex:int;
		private var _numCommandsInHistory:Number;
		private var _commandDelegates:Dictionary;
		private var _shared:SharedObject;
		
		public function CoolConsole(openKey:int)
		{
			addEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
			
			_shared = SharedObject.getLocal("history");
			
			_openKey = openKey;
			_executeKey = flash.ui.Keyboard.ENTER;
			_prevHistoryKey = flash.ui.Keyboard.UP;
			_nextHistoryKey = flash.ui.Keyboard.DOWN;
			_historyMax = 25;
			_showing = false;
			_currHistoryIndex = 0;
			_numCommandsInHistory = 0;
			
			if (_shared.data.history)
			{
				_commandHistory = _shared.data.history as Array;
				_numCommandsInHistory = _commandHistory.length;
			}
			else
			{
				_commandHistory = new Array();
				_shared.data.history = _commandHistory;
			}
			_commandDelegates = new Dictionary();
			
			_inputField = addChild(new TextField()) as TextField;
			_inputField.type = TextFieldType.INPUT;
			_inputField.addEventListener(FocusEvent.FOCUS_OUT, onConsoleFocusOut);
			_inputField.defaultTextFormat = new TextFormat("_sans", 14, 0xFFFFFF, false, false, false);
			
			makeConsoleInvisible();
		}
		public function get opened() { return _showing; }
		public function clearStoredHistory():void
		{
			_shared.clear();
		}
		
		public function addCommand(name:String, func:Function):void
		{
			_commandDelegates[name] = func;
		}
		
		public function addCommandToHistory(command:String):void
		{
			var commandIndex:int = _commandHistory.indexOf(command);
			if (commandIndex != -1)
			{
				_commandHistory.splice(commandIndex, 1);
				_numCommandsInHistory--;
			}
				
			_commandHistory.push(command);
			_numCommandsInHistory++;
			
			if (_commandHistory.length > _historyMax)
			{
				_commandHistory.shift();
				_numCommandsInHistory--;
			}
			
			_shared.flush();
		}
		
		public function getPreviousHistoryCommand():String
		{
			if (_currHistoryIndex > 0)
				_currHistoryIndex--;
			
			return getCurrentCommand();
		}
		
		public function getNextHistoryCommand():String
		{
			if (_currHistoryIndex < _numCommandsInHistory)
				_currHistoryIndex++;
				
			return getCurrentCommand();
		}
		
		public function getCurrentCommand():String
		{
			var command:String = _commandHistory[_currHistoryIndex];
			
			if (!command)
			{
				return "";
			}
			return command;
		}
		
		public function toggleConsole():void
		{
			if (_showing)
				hideConsole();
			else
				showConsole();
		}
		
		public function showConsole():void
		{
			if (!_showing)
			{
				_showing = true;
				makeConsoleVisible();
				stage.focus = _inputField;
				stage.addEventListener(KeyboardEvent.KEY_UP, onKeyPressInConsole);
				_currHistoryIndex = _numCommandsInHistory;
			}
		}
		
		public function hideConsole():void
		{
			if (_showing)
			{
				_showing = false;
				makeConsoleInvisible();
				stage.removeEventListener(KeyboardEvent.KEY_UP, onKeyPressInConsole);
			}
		}
		
		public function clearConsole():void
		{
			_inputField.text = "";
		}
		
		private function onAddedToStage(event:Event):void
		{
			graphics.beginFill(0x000000, .8);
			graphics.drawRect(0, 0, stage.stageWidth, 30);
			graphics.endFill();
			
			_inputField.width = stage.stageWidth;
			_inputField.y = 4;
			_inputField.x = 4;
			
			stage.addEventListener(KeyboardEvent.KEY_UP, onToggleKeyPress);
		}
		
		private function onConsoleFocusOut(event:FocusEvent):void
		{
			hideConsole();
		}
		
		private function onToggleKeyPress(event:KeyboardEvent):void
		{
			if (event.keyCode == _openKey)
			{
				toggleConsole();
			}
		}
		
		private function onKeyPressInConsole(event:KeyboardEvent):void
		{
			if (event.keyCode == _executeKey)
			{
				if (_inputField.text == "" || _inputField.text == " ")
					return;
 
				addCommandToHistory(_inputField.text);
				
				var args:Array = _inputField.text.split(" ");
				var command:String = args.shift();
				clearConsole();
				hideConsole();
				
				var func:Function = _commandDelegates[command];
				if (func != null)
				{
					try
					{
						func.apply(this, args);
					}
					catch(e:ArgumentError)
					{
						if (e.errorID == 1063)
						{
							var expected:Number = Number(e.message.slice(e.message.indexOf("Expected ") + 9, e.message.lastIndexOf(",")));
							var lessArgs:Array = args.slice(0, expected);
							func.apply(this, lessArgs);
						}
					}
				}
			}
			else if (event.keyCode == _prevHistoryKey)
			{
				_inputField.text = getPreviousHistoryCommand();
				event.preventDefault();
				_inputField.setSelection(_inputField.text.length, _inputField.text.length);
			}
			else if (event.keyCode == _nextHistoryKey)
			{
				_inputField.text = getNextHistoryCommand();
				event.preventDefault();
				_inputField.setSelection(_inputField.text.length, _inputField.text.length);
			}
		}
		
		private function makeConsoleVisible():void
		{
			this.visible = true;
		}
		
		private function makeConsoleInvisible():void
		{
			this.visible = false;
		}
	}
}