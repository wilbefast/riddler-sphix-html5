package  
{
	import flash.display.MovieClip;
	
	/**
	 * ...
	 * @author Jami
	 */
	public class GameMenu extends MovieClip 
	{
		
		public function GameMenu() 
		{
			super();
			
		}
		public function sendWord(str:String):Boolean
		{
			return (str.toUpperCase() == "READY");
			
		}
	}

}