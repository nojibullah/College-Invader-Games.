let   score = 0;
let  scoreStorage = 0;// keeps track of extra lives scores
let highscore;

class Scoreboard {
  /* scoreboard properties */
  

  // constructor 
  constructor(canvas, health, trueHighscore)
  {
    this.canvas = canvas
    this.width = 20; // default 40
    this.height = 20; // default 40
    this.positionX = (0);
    this.positionY = (10);
    this.Health = health;
    highscore = trueHighscore;
    this.drawScoreboard = this.drawScoreboard.bind(this);
  }

  /* functions */
  // update score
  addToScore(num)
  {
    score += num;
    scoreStorage += num;
  }
  
  addExtra()
  {
    if(scoreStorage == 10000)
      {
        scoreStorage -= 10000;
        this.Health.healthModifier(1);
      }
  }

  trackhighscore(score)
  {
    if(score > highscore)
    {
      highscore = score;
    }
  }

  resetScore()
  {
    score = 0;
    scoreStorage = 0;
  }
  
  // player current score
  drawScoreboard(canvContext, xPos, yPos)
  { 
    function text()
      {
        let text = "Score: "+ score; 
        let t = "Highscore: " + highscore;
        canvContext.font = "20px Arial";
        canvContext.fillStyle = "white";
        
        canvContext.fillText(text, xPos , yPos);
        canvContext.fillText(t, xPos , yPos + 20);
      }

    text();
    this.trackhighscore(score);
    this.addExtra();
  }
}

export default Scoreboard;