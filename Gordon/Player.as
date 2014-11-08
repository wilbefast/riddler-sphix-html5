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
		public function Player() 
		{
			initPosX = this.x;
			initPosY = this.y;
		}
		public function shake(repeatCount:int):void 
		{
			
			TweenMax.to(this, 0.1, { repeat:repeatCount - 1, y:this.y + (1 + Math.random() * 5), x:this.x + (1 + Math.random() * 5), delay:0.1, ease:Expo.easeInOut, onComplete:function ResetPos() { this.x = initPosX; this.y = initPosY; }} );
		}
	}

}