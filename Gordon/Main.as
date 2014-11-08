package  
{
	import com.greensock.easing.*;
	import com.greensock.TweenMax;
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.external.ExternalInterface;
	import flash.system.Security;
	import flash.text.TextField;
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
			gameMenu = new GameMenu();
			inMenu = true;
			addChild(gameMenu);
		}
		
		function receiveWords(s:String) {
			
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
		function receiveScore(amount:int) {
			
		}
		
	}

}