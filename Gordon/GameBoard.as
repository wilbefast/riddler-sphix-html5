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
		
		public function GameBoard() 
		{
			super();
			addEventListener(Event.ADDED_TO_STAGE, added);
			
		}
		private function added(e:Event):void 
		{
			removeEventListener(Event.ADDED_TO_STAGE, added);
			subString = TextField(getChildByName("sub"));
			player1 = Player(getChildByName("TheP1"));
			player2 = Player(getChildByName("TheP2"));
			addEventListener(Event.ENTER_FRAME,update);
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
		public function sendWord(str:String):void 
		{
			subString.appendText(str+" ");
			var theText:BattleText = new BattleText();
			theText.setText(str);
			theText.x = 100;
			theText.y = 350;
			addChild(theText);
			TweenMax.to(theText, 0.8, { x: 700, y:Math.random() * 250 + 100, ease:Ease.easeIn, onComplete:function destroyText() { ScreenShake(); removeChild(theText); } } );
		
		}
	}

}