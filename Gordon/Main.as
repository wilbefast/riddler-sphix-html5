package  
{
	import com.greensock.easing.*;
	import com.greensock.TweenMax;
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.external.ExternalInterface;
	import flash.system.Security;
	import flash.text.TextField

	/**
	 * ...
	 * @author Jami
	 */
	public class Main extends MovieClip
	{
		public var gameBoard:GameBoard;
		public var gameMenu:GameMenu;
		public var inMenu:Boolean;
		public var inGame:Boolean;
		public function Main() 
		{
            Security.allowDomain("*");
			ExternalInterface.addCallback("addWord", receiveWords);
			ExternalInterface.addCallback("nextRound", checkRound);
			ExternalInterface.addCallback("changeMode", checkRound);
			gameMenu = new GameMenu();
			inMenu = true;
			addChild(gameMenu);
			//receiveWords("[[\"I\",0.8,\"\"],[\"love\",0.2,\"\"],[\"cheese\",1,\"\"],[\"!\",0,\"\"]]");
			//receiveWords("ready");
		}
		
		function receiveWords(s:String) {
		
			//JSON.parse(s);
			if (s == "nextRound") 
			{
				checkRound();
				return;
			}
			switch (true) 
			{
				case (inMenu && gameMenu.sendWord(s)) :
					removeChild(gameMenu);
					gameBoard = new GameBoard();
					addChild(gameBoard);
					inMenu = false;
					inGame = true;
				break;
				case (inGame) :
					gameBoard.sendWord(s);
				break;
				
				default:
			}
			
		}
	
		function checkRound()
		{
			if (inGame)
			{
				gameBoard.checkRound();
			}
		}
		function receiveScore(amount:int) {
			
		}
		
	}

}