package  
{
	import com.greensock.easing.*;
	import com.greensock.TweenMax;
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.events.TimerEvent;
	import flash.external.ExternalInterface;
	import flash.system.Security;
	import flash.text.TextField
	import flash.ui.Keyboard;
	import flash.utils.Timer;

	/**
	 * ...
	 * @author Jami
	 */
	public class Main extends MovieClip
	{
		private var json_in;
		
		public var gameBoard:GameBoard;
		public var gameMenu:GameMenu;
		public var gameRules:GameRules;
		public var gameReview:GameReview;
		public var gameHandOver:GameHandOver;
		
		public var inMenu:Boolean;
		public var inGame:Boolean;
		public var console:CoolConsole;
		public var timer:Timer;
		public var jsonIndex:int;
		public var actualRule:int;
		public var actualPlayer:int;
		public var actualRound:int;
		
		public function Main() 
		{
            Security.allowDomain("*");
			console = new CoolConsole(Keyboard.F8);
			addChild(console);
			
			ExternalInterface.addCallback("addWord", receiveWords);
			ExternalInterface.addCallback("addWordsWithScore", receiveWordsScore);
			ExternalInterface.addCallback("setState", changeState);
			ExternalInterface.addCallback("setRule", setRule);
			ExternalInterface.addCallback("setPlayer", setPlayer);
			ExternalInterface.addCallback("setRound", setRound);
			
			console.addCommand("addWord", receiveWords);
			console.addCommand("addWordsWithScore", receiveWordsScore);
			console.addCommand("setState", changeState);
			
			//receiveWordsScore("[[\"I\",0.8,\"\"],[\"love\",0.2,\"\"],[\"cheese\",1,\"\"],[\"!\",0,\"\"]]");
			
			//[["I",0.8,""],["love",0.2,""],["cheese",1,""],["!",0,""],["I",0.8,""],["love",0.2,""],["cheese",1,""],["!",0,""],["I",0.8,""],["love",0.2,""],["cheese",1,""],["!",0,""],["I",0.8,""],["love",0.2,""],["cheese",1,""],["!",0,""]]
			//receiveWords("ready");
			gameMenu = new GameMenu();
			gameRules = new GameRules();
			gameBoard = new GameBoard();
			gameReview = new GameReview();
			gameHandOver = new GameHandOver();
			
			timer = new Timer(0);
			timer.addEventListener(TimerEvent.TIMER, showWords);
			loaded();
		}
		public function loaded():void 
		{
			ExternalInterface.call("SWFLoaded");
		}
		private function showWords(e:TimerEvent):void 
		{
			gameBoard.sendWord(json_in[jsonIndex][0], json_in[jsonIndex][1]);
			jsonIndex++;
			
		}
		
		function receiveWords(s:String) {
		
			gameBoard.sendWord(s,0);
		}
		function receiveWordsScore(s:String)
		{
			json_in = JSON.parse(s);
			jsonIndex = 0;
			timer.reset();
			timer.delay = 10000 / json_in.length;
			timer.repeatCount = json_in.length;
			timer.start();
		}
		function changeState(s:String)
		{
			switch (s)
			{
				case "title" :
					inMenu = true;
					inGame = false;
					addChild(gameMenu);
-					gameMenu.gotoAndPlay(1);
				break;
				case "rules" :
					if (contains(gameMenu)) removeChild(gameMenu);
					if (contains(gameHandOver)) removeChild(gameHandOver);
					addChild(gameRules);
					gameRules.setRules(actualRule);
					inMenu = false;
				break;
				case "rap" :
					if (contains(gameRules)) removeChild(gameRules);
					addChild(gameBoard);
					gameBoard.init();
					gameBoard.setPlayer(actualPlayer);
					gameBoard.setRound(actualRound);
					inMenu = false;
					inGame = true;
				break;
				case "review" :
					inGame = false;
				break;
				case "handOver" :
					if (contains(gameReview)) removeChild(gameReview);
					addChild(gameHandOver);
					
				break;
				
			}
		}
		function setPlayer(number:int)
		{
			actualPlayer = number;
		}
		
		public function setRule(number:int):void 
		{
			actualRule = number;
		}
		
		public function setRound(number:int):void 
		{
			actualRound = number;
		}
		
	}

}