package  
{
	import com.greensock.easing.Ease;
	import com.greensock.TweenMax;
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.text.TextField;
	
	/**
	 * ...
	 * @author Jami
	 */
	public class GameBoard extends MovieClip 
	{
		private var tempo:Number;
		public var shake:Boolean;
		public var subString:TextField; 
		public var player1:Player;
		public var player2:Player;
		public var actualplayer:Player;
		public var round:int;
		public var wordDestinationX:int;
		public var roundText:TextField;
		
		public function GameBoard() 
		{
			super();
			addEventListener(Event.ADDED_TO_STAGE, added);
			round = 1;
		}
		private function added(e:Event):void 
		{
			removeEventListener(Event.ADDED_TO_STAGE, added);
			subString = TextField(getChildByName("sub"));
			player1 = Player(getChildByName("TheP1"));
			player2 = Player(getChildByName("TheP2"));
			roundText = TextField(getChildByName("roundtf"));
			addEventListener(Event.ENTER_FRAME, update);
			checkRound();
		}
		public function init():void 
		{
			subString.text = "";
		}
		public function checkRound():void 
		{
			roundText.text = String(round);
			round++;
			subString.text = "";
			if (round % 2 == 0)
			{
				actualplayer = player1;
				wordDestinationX = 700;
			}else
			{
				actualplayer = player2;
				wordDestinationX = 100;
			}
		}
		private function update(e:Event):void 
		{
			if (shake)
			{
				this.x = 0;
				this.y = 0;
				this.y += (-5 + Math.random() * 10);
				this.x += ( -5 + Math.random() * 10);
				if (tempo-- <= 0)
				{
					shake = false;
				}
				
			}else
			{
				this.x = 0;
				this.y = 0;
			}
		}
		
		private function ScreenShake()
		{
			shake = true;
			tempo = 20;
		}
		public function sendWord(str:String,score:Number):void 
		{
			subString.appendText(str+" ");
			var theText:BattleText = new BattleText();
			theText.setText(str);
			theText.x = actualplayer.x;
			theText.y = actualplayer.y;
			addChild(theText);
			actualplayer.talk();
			theText.rotation = Math.random() * 360;
			TweenMax.to(theText, Math.random(), { scaleX: theText.scaleX + score, scaleY: theText.scaleY + score, x: wordDestinationX, y:Math.random() * 250 + 100, ease:Ease.easeIn, onComplete:function destroyText() { ScreenShake(); removeChild(theText); } } );
		}
	}

}