package  
{
	import com.greensock.easing.*;
	import com.greensock.TweenMax;
	import flash.display.MovieClip;
	import flash.external.ExternalInterface;
	import flash.system.Security;
	import flash.text.TextField;
	/**
	 * ...
	 * @author Jami
	 */
	public class Main extends MovieClip
	{
		public var subString:TextField; 
		public function Main() 
		{
            Security.allowDomain("*");
			subString = TextField(getChildByName("sub"));
			ExternalInterface.addCallback("addWord", receiveWords);

		}
		function receiveWords(s:String) {
			subString.appendText(s+" ");
			sendWord(s);
		}
		function receiveScore(amount:int) {
			
		}
		function sendWord(str:String)
		{
			var theText:BattleText = new BattleText();
			theText.setText(str);
			theText.x = 100;
			theText.y = 350;
			addChild(theText);
			TweenMax.to(theText, 1, { x: 700, y:Math.random() * 250 + 100, ease:Bounce.easeInOut, onComplete:function destroyText() { removeChild(theText); } } );
		}
	}

}