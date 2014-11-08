package  
{
	import flash.display.MovieClip;
	import flash.text.TextField;
	
	/**
	 * ...
	 * @author Jami
	 */
	public class BattleText extends MovieClip 
	{
		public var myText:TextField;
		public function BattleText() 
		{
			super();
			myText = TextField(getChildByName("tf"));
		}
		public function setText(str:String):void 
		{
			myText.text = str;
		}
	}

}