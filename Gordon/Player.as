package  
{
	import com.greensock.easing.Expo;
	import com.greensock.TweenMax;
	import flash.display.MovieClip;
	import flash.events.Event;
	
	/**
	 * ...
	 * @author Jami
	 */
	public class Player extends MovieClip 
	{
		public var initPosX:Number;
		public var initPosY:Number;
		public var mcMouth:MovieClip;
		public var counter:int;
		
		public function Player() 
		{
			initPosX = this.x;
			initPosY = this.y;
			mcMouth = MovieClip(getChildByName("mouth"));
		}
		public function bounce():void 
		{
			TweenMax.to(this,0.3,{y:this.y - 5,yoyo:true,repeat:-1});
		}
		public function talk():void 
		{
			mcMouth.gotoAndPlay(1);
		}
	}

}