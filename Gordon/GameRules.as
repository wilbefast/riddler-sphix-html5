package  
{
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
		}
		
		public function setRules(actualRule:int):void 
		{
			gotoAndStop(actualRule);
		}
		
	}

}