package  
{
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.events.TimerEvent;
	import flash.text.TextField;
	import flash.utils.Timer;
	
	/**
	 * ...
	 * @author Jami
	 */
	public class GameOver extends MovieClip 
	{
		public var timer:Timer;
		public var p1:TextField;
		public var p2:TextField;
		private var tfP1Score:int;
		private var tfP2Score:int;
		private var iP1ScoreMax:int;
		private var iP2ScoreMax:int;
		private var maxScore:int;
		private var localP1Score:int;
		private var localP2Score:int;
		private var mcPlayer1:MovieClip;
		private var mcPlayer2:MovieClip;
		private var counter:int = 200;
		
		// 530 Max Y
		public function GameOver() 
		{
			super();
			timer = new Timer(1);
			timer.addEventListener(TimerEvent.TIMER, updateScores);
			p1 = TextField(getChildByName("p1Score"));
			p2 = TextField(getChildByName("p2Score"));
			mcPlayer1 = MovieClip(getChildByName("player1"));
			mcPlayer2 = MovieClip(getChildByName("player2"));
		}
		public function setPlayerScore(iP1Score:int,iP2Score:int):void 
		{
			iP1ScoreMax = iP1Score;
			iP2ScoreMax = iP2Score;
			mcPlayer1.y = 930;
			mcPlayer2.y = 1030;
			if (iP1Score > iP2Score)
			{
				maxScore = iP1Score;
			}else
			{
				maxScore = iP2Score;
			}
			addEventListener(Event.ENTER_FRAME, updateScores);
		}
		public function updateScores(te:Event):void 
		{
			var continue1:Boolean = false;
			var continue2:Boolean = false;
			
			if ((localP1Score + counter) < iP1ScoreMax)
			{
				localP1Score += counter;
				p1.text = String(localP1Score);
				mcPlayer1.y = 930 - (localP1Score / maxScore) * 500;
				continue1 = true;
			}else if (localP1Score != iP1ScoreMax)
			{
				p1.text = String(iP1ScoreMax);
				mcPlayer1.y = 930 - (iP1ScoreMax / maxScore) * 500;
			}
			if ((localP2Score + counter) < iP2ScoreMax)
			{
				localP2Score += counter;
				p2.text = String(localP2Score);
				mcPlayer2.y = 1030 - (localP2Score / maxScore) * 500;
				continue2 = true;
			}else if (localP2Score != iP2ScoreMax)
			{
				p2.text = String(iP2ScoreMax);
				mcPlayer2.y = 1030 - (iP2ScoreMax / maxScore) * 500;
			}
			if (!continue1 && !continue2)
			{
				removeEventListener(Event.ENTER_FRAME,updateScores);
			}
		}
		
	}

}