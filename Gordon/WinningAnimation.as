package  
{
	import flash.display.MovieClip;
	/**
	 * ...
	 * @author Jami
	 */
	public class WinningAnimation extends MovieClip
	{
		public var mcP1Win:MovieClip;
		public var mcP2Win:MovieClip;
		
		public function WinningAnimation() 
		{
			stop();
			mcP1Win = MovieClip(getChildByName("p1Win"));
			mcP2Win = MovieClip(getChildByName("p2Win"));
			mcP1Win.gotoAndStop(1);
			mcP2Win.gotoAndStop(1);
		}
		public function init():void 
		{
			mcP1Win.gotoAndStop(1);
			mcP2Win.gotoAndStop(1);
		}
		
		public function winningPlayer(number:Number):void 
		{
			if (number == 1)
			{
				mcP1Win.play();
			}else
			{
				mcP2Win.play();
			}
		}
	}

}