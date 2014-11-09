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
		public var gameOver:GameOver;
		public var gameCredits:GameCredits;
		public var inMenu:Boolean;
		public var inGame:Boolean;
		public var console:CoolConsole;
		public var timer:Timer;
		public var jsonIndex:int;
		public var actualRule:String;
		public var actualPlayer:int = 1;
		public var actualRound:int = 1;
		
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
			ExternalInterface.addCallback("setScore", setScore);
			
			console.addCommand("addWord", receiveWords);
			console.addCommand("addWordsWithScore", receiveWordsScore);
			console.addCommand("setState", changeState);
			console.addCommand("setRule", setRule);
			console.addCommand("setPlayer", setPlayer);
			console.addCommand("setRound", setRound);
			console.addCommand("setScore", setScore);
				
			//receiveWordsScore("[[\"I\",0.8,\"\"],[\"love\",0.2,\"\"],[\"cheese\",1,\"\"],[\"!\",0,\"\"]]");
			//addWordsWithScore [["I",0.08,""],["love",0.02,""],["cheese",0.1,""],["!",0,""]]
			//[["I",0.8,""],["love",0.2,""],["cheese",1,""],["!",0,""],["I",0.8,""],["love",0.2,""],["cheese",1,""],["!",0,""],["I",0.8,""],["love",0.2,""],["cheese",1,""],["!",0,""],["I",0.8,""],["love",0.2,""],["cheese",1,""],["!",0,""]]
			//receiveWords("ready");
			gameMenu = new GameMenu();
			gameRules = new GameRules();
			gameBoard = new GameBoard();
			gameReview = new GameReview();
			gameHandOver = new GameHandOver();
			gameOver = new GameOver();
			gameCredits = new GameCredits();
			
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
			jsonIndex = 1;
			showWords(null);
			timer.reset();
			timer.delay = 10000 / json_in.length-1;
			timer.repeatCount = json_in.length-2;
			timer.start();
		}
		function changeState(s:String)
		{
			switch (s)
			{
				case "title" :
					if (contains(gameCredits)) removeChild(gameCredits);
					if (contains(gameOver)) removeChild(gameOver);
					inMenu = true;
					inGame = false;
					addChild(gameMenu);
					gameMenu.gotoAndPlay(1);
				break;
				case "rules" :
					if (contains(gameMenu)) removeChild(gameMenu);
					if (contains(gameHandOver)) removeChild(gameHandOver);
					gameRules.setRules(actualRule);
					addChild(gameRules);
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
					if (contains(gameBoard)) removeChild(gameBoard);
					addChild(gameHandOver);
				break;
				case "gameOver" :
					if (contains(gameBoard)) removeChild(gameBoard);
					gameOver.init();
					addChild(gameOver);
				break;
				case "gameCredits" :
					if (contains(gameMenu)) removeChild(gameMenu);
					addChild(gameCredits);
				break;
				
			}
		}
		function setScore(s:String)
		{
			var json_score = JSON.parse(s);
			var score1:int = Math.floor(json_score[0] * 100);
			var score2:int = Math.floor(json_score[1] * 100);
			
			gameOver.setPlayerScore(score1*1000, score2*1000);
		}
		function setPlayer(number:int)
		{
			actualPlayer = number + 1;
		}
		
		public function setRule(s:String):void 
		{
			actualRule = s;
		}
		
		public function setRound(number:int):void 
		{
			actualRound = number;
		}
		
	}

}