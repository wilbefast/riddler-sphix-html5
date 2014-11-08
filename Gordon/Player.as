package  
{
	import com.greensock.easing.Expo;
	import com.greensock.TweenMax;
	import flash.display.MovieClip;
	
	/**
	 * ...
	 * @author Jami
	 */
	public class Player extends MovieClip 
	{
		public var initPosX:Number;
		public var initPosY:Number;
		public var mcMouth:MovieClip;
		
		public function Player() 
		{
			initPosX = this.x;
			initPosY = this.y;
			mcMouth = MovieClip(getChildByName("mouth"));
		}
		public function talk():void 
		{
			mcMouth.gotoAndPlay(1);
		}
	}

}