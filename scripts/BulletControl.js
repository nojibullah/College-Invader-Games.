/**
 * @file BulletControl.js
 * 
 * @description BulletControl.js serves as the actual weapon in the game 
 * 
 * the bullet for the player or enemy will be gathered in an array in here and set to shoot when ever the player or an enemy wants to shoot.
 *
 */


import Bullet from "./Bullet.js"


class BulletControl {
  /* resposbile for shooting */
  bullets = [];

  waitTime = 0;
  // constructor
  /**
   * 
   * @var waitTime is the delay for how frequent the caller will shoot
   * @var bullets is an array that will store the bullets that will be set to draw the respected projectile
   */
  constructor(canvas) {
    // the minute bulletControl is called it should be constructed on the canvas it was given  
    this.canvas = canvas;

    this.shoot = this.shoot.bind(this);
    this.isOffScreen = this.isOffScreen.bind(this);
    this.draw = this.draw.bind(this);
    this.getBulletInfo = this.getBulletInfo.bind(this);
    this.destroyBullet = this.destroyBullet.bind(this);
    this.clearBullets = this.clearBullets.bind(this);
  }

  // x coordinate 
  // y coordinate 
  // speed speed of bullet  
  // delay

  shoot(x, y, speed, delay, shooter) {
    /**
     * Loggers for testing
     */
    //console.log("shooting");
    //console.log(this.waitTime);
    //console.log(this.bullets);
    // will make an array to push bullets inside

    this.shooter = shooter;

    if (this.waitTime <= 0) {
      this.bullets.push(new Bullet(x, y, speed, shooter));
      this.waitTime = delay;
    }

    // NEEDS TO be here or else only one enemy shoots 
    if (shooter != "player") {
      this.waitTime--;
    }

  }



  //function to check if bullet is off screen
  isOffScreen(Bullet) { // takes in the bullet in question

    /*Bullet y should be about where the player is when they shot 
      Bullet height should be 15 according to bullet.js 
      if the y-axis is ever less than the bullet height its off screen */

    if (Bullet.y <= -this.canvas.height) {
      return true;
    }
    else {
      return false;
    }



  }
  //Making each bullet that is in the array Look the same
  draw(ctx) {

    /**
     * @description for below if statement ONLY this first one
     * This is here so that the player can just tap to shoot instead of holding V to shoot
     * 
     * this is here to be like a timer so that the player has a reload time before every shot
     * 
     */
    if (this.shooter == "player") {
      this.waitTime--;
    }

    this.bullets.forEach((Bullet) => {

      //find the specaifc bullet for each bullet created on screen
      if (this.isOffScreen(Bullet)) {

        const index = this.bullets.indexOf(Bullet);// the exact bullet that came off the screen
        this.bullets.splice(index, 1); //destroying that bullet
      }

      Bullet.draw(ctx)
    });



  }

  getBulletInfo() { // getter function for collison 
    return this.bullets;
  }

  destroyBullet(bulletToDestroy) {
    const bulletIndex = this.bullets.indexOf(bulletToDestroy);
    if (bulletIndex > -1) {
      this.bullets.splice(bulletIndex, 1);
    }
  }

  clearBullets() {
    this.bullets.length = 0; // clear all bullets from the bullet controller
  }


}
export default BulletControl;