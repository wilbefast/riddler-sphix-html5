package  
{
	import com.greensock.TweenMax;
	import flash.display.MovieClip;
	
	/**
	 * ...
	 * @author Jami
	 */
	public class GameRules extends MovieClip 
	{
		
		public function GameRules() 
		{
			super();
			stop();
			TweenMax.to(this.getChildAt(numChildren-1), 0.3, { y:this.getChildAt(numChildren-1).y - 2, yoyo:true, repeat: -1 } );
		}
		
		public function setRules(actualRule:String):void 
		{
			gotoAndStop(actualRule);
		}
		
	}

}