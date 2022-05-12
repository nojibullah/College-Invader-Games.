import Scoreboard from "./Scoreboard.js";

let maxHP = 3; //temp health to be removed when damaged
let hp = maxHP;
let tempHPBlock = false;
class Lives {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = 40;
    this.height = 25;
    this.positionX = 0;
    this.positionY = 10;
    this.drawLives = this.drawLives.bind(this);
  }

  hearts(canvContext, j) {
    canvContext.fillStyle = "lightgreen";
    canvContext.fillRect(j, this.positionY, this.width, this.height);
  }

  heartSlots(canvContext, j) {
    canvContext.strokeStyle = "green";
    canvContext.strokeRect(j, this.positionY, this.width, this.height);
  }

  healthModifier(i) { //negative for taking damage, positive for adding health
    hp = hp + i;

    if (tempHPBlock == false) {
      maxHP = maxHP + i;
    }

    if (maxHP > 3) {
      maxHP = 3;
    }
  }

  text(canvContext) {
    let text = "Lives: " + hp;
    canvContext.font = "20px Arial";
    canvContext.fillText(text, 250, 40);
    canvContext.fillStyle = "white";
  }

  //lives shape
  drawLives(canvContext) {
    for (let i = 1; i <= maxHP - 1; i++) {
      //hearts filled
      let j = i * 60;
      this.hearts(canvContext, j);
      this.heartSlots(canvContext, j);
    }

    function tempHP() {
      //extra lives appearance
      let s = Scoreboard.score;

      if (s >= 10000 || hp > 3) {
        canvContext.fillStyle = "DeepSkyBlue";
        canvContext.fillRect(3 * 60, 10, 40, 25);
        canvContext.strokeStyle = "DarkBlue";
        canvContext.strokeRect(3 * 60, 10, 40, 25);
        tempHPBlock = true;
      } else {
        tempHPBlock = false;
      }
    }

    function livesBorder() {
      if (tempHPBlock == false) {
        canvContext.strokeStyle = "white";
        canvContext.strokeRect(40, 5, 49 * 3, 40);
      } else {
        canvContext.strokeStyle = "white";
        canvContext.strokeRect(40, 5, 49 * 4, 40);
      }
    }

    livesBorder();
    this.text(canvContext);
    tempHP();
  }

  //getter function to help with the 0 Health mechanic
  getCurrenthp() {
    return hp;
  }

  resetHp() {
    maxHP = 3;
    hp = maxHP;
  }
}
export default Lives;
