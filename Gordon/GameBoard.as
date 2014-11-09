package  
{
	import com.greensock.easing.Ease;
	import com.greensock.TweenMax;
	import flash.display.MovieClip;
	import flash.events.Event;
	import flash.events.TimerEvent;
	import flash.media.Sound;
	import flash.text.TextField;
	import flash.utils.Timer;
	
	/**
	 * ...
	 * @author Jami
	 */
	public class GameBoard extends MovieClip 
	{
		private var tempo:Number;
		public var shake:Boolean;
		public var subString:TextField; 
		public var player1:Player;
		public var player2:Player;
		public var actualplayer:Player;
		public var round:int;
		public var wordDestinationX:int;
		public var roundText:TextField;
		public var timerBar:MovieClip;
		public var iActualPlayer:int;
		public var scoreBar:MovieClip;
		public var timer:Timer;
		public var micro1:MovieClip;
		public var micro2:MovieClip;
		public var scoreBarScore:int;
		
		public function GameBoard() 
		{
			super();
			addEventListener(Event.ADDED_TO_STAGE, added);
			timer = new Timer(1000,10);
			timer.addEventListener(TimerEvent.TIMER, passTime);
			round = 1;
		}
		private function added(e:Event):void 
		{
			removeEventListener(Event.ADDED_TO_STAGE, added);
			subString = TextField(getChildByName("sub"));
			player1 = Player(getChildByName("TheP1"));
			player2 = Player(getChildByName("TheP2"));
			player1.bounce();
			player2.bounce();
			roundText = TextField(getChildByName("roundtf"));
			timerBar = MovieClip(getChildByName("tmBarre"));
			scoreBar = MovieClip(getChildByName("scoreBG"));
			micro1 = MovieClip(getChildByName("mic1"));
			micro2 = MovieClip(getChildByName("mic2"));
			
			TweenMax.to(micro1, 0.3, { delay:0.15, y:micro1.y - 5, yoyo:true, repeat: -1 } );
			TweenMax.to(micro2, 0.3, { delay:0.15, y:micro2.y - 5, yoyo:true, repeat: -1 } );
			
			addEventListener(Event.ENTER_FRAME, update);
			scoreBarScore = 100;
			scoreBar.gotoAndStop(scoreBarScore);
			TweenMax.to(timerBar,1,{y:timerBar.y - 3,yoyo:true,repeat:-1});
			TweenMax.to(subString,1,{y:subString.y - 3,yoyo:true,repeat:-1});
			TweenMax.to(roundText,1,{scaleX:roundText.scaleX + 0.1,scaleY:roundText.scaleY + 0.1,x:roundText.x - 2,y:roundText.y - 2, yoyo:true,repeat:-1});
		}
		public function resetScore():void 
		{
			scoreBarScore = 0;
		}
		private function passTime(e:TimerEvent):void 
		{
			timerBar.nextFrame();
		}
		public function init():void 
		{
			subString.text = "";
			timerBar.gotoAndStop(1);
			timer.reset();
			playSound("reload");
			timer.start();
		}
		public function setRound(round:int):void 
		{
			roundText.text = String(round);
			subString.text = "";
			
		}
		private function update(e:Event):void 
		{
			if (shake)
			{
				this.x = 0;
				this.y = 0;
				this.y += (-5 + Math.random() * 10);
				this.x += ( -5 + Math.random() * 10);
				if (tempo-- <= 0)
				{
					shake = false;
				}
				
			}else
			{
				this.x = 0;
				this.y = 0;
			}
		}
		
		private function ScreenShake()
		{
			shake = true;
			tempo = 20;
		}
		public function sendWord(str:String,score:Number):void 
		{
			var coefDir:int = 100;
			subString.appendText(str + " ");
			if (iActualPlayer == 2)
			{
				coefDir = -100;
			}
			
			scoreBarScore += int(coefDir * score);
			TweenMax.to(scoreBar, 0.3, { frame:scoreBarScore, ease:Ease.easeOut } );
			
			var theText:BattleText = new BattleText();
			theText.setText(str);
			theText.x = actualplayer.x;
			theText.y = actualplayer.y;
			addChild(theText);
			actualplayer.talk();
			theText.rotation = Math.random() * 100 - 50;
			playSound("gun");
			if (score > 0.02)
				TweenMax.to(theText, Math.random() * 0.5 + 0.5, { scaleX: theText.scaleX + score * 20, scaleY: theText.scaleY + score * 20, x: wordDestinationX, y:Math.random() * 250 + 100, ease:Ease.easeIn, onComplete:function destroyText() { ScreenShake(); playSound(randomHitSound()); var explo:Explosion = new Explosion(); explo.x = theText.x; explo.y = theText.y; addChild(explo); removeChild(theText); } } );
			else
				TweenMax.to(theText, Math.random() * 0.5 + 0.5, { alpha:0, scaleX: theText.scaleX + score, scaleY: theText.scaleY + score, x: wordDestinationX + 2*coefDir, y:Math.random() * 250 + 100, ease:Ease.easeIn, onComplete: function destroyText() { playSound("miss"); removeChild(theText); } } );
		}
		
		public function setPlayer(_actualPlayer:int):void 
		{
			iActualPlayer = _actualPlayer;
			if (iActualPlayer == 1)
			{
				micro1.gotoAndPlay(1);
				micro2.gotoAndStop(1);
				actualplayer = player1;
				wordDestinationX = 700;
			}else
			{
				micro1.gotoAndStop(1);
				micro2.gotoAndPlay(1);
				actualplayer = player2;
				wordDestinationX = 100;
			}
		}
		public function randomHitSound():String 
		{
			return "hit" + int(Math.random() * 5 + 1);
		}
		public function playSound(str:String)
		{
			var snd:Sound;
			switch (str) 
			{
				case "hit1":
					snd = new Hit01();
				break;
				case "hit2":
					snd = new Hit02();
					
				break;
				case "hit3":
					snd = new Hit03();
					
				break;
				case "hit4":
					snd = new Hit04();
					
				break;
				case "hit5":
					snd = new Hit05();
					
				break;
				case "miss":
					snd = new miss();
				break;
				case "gun":
					snd = new gunfire();
				break;
				case "reload":
					snd = new guncock();
				break;
				default:
			}
			snd.play(0, 0);
		}
	}

}