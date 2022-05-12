/**
 * @todo SEARCH FOR '@todo' TO SEE ITEMS THAT STILL NEED TO BE WORKED ON
 *
 * @file Player.js
 * @description The Player Class is a schema used to create a Player Object.
 * Only one Player Object should exist at any given time while the game is running.
 * User will control the Player Object to interact with the game environment.
 *
 * This class will define how the Player can move and how the Player can shoot
 * Movement will be in one dimension (horizontal) and handled by Keyboard Event handlers on the window
 * Shooting will be in one dimension (vertical) and handled by a BulletControl Class instance
 *
 */

import { CANVAS, PADDING } from "./ui/uiConstants.js";

class Player {
  /**
   * @constructor
   * @param {BulletControl} BulletControl - class instance that will handle the Player shooting projectiles
   * @param {Lives} lives - class instance that will handle the Player's health status
   */
  constructor(BulletControl, lives) {
    this.BulletControl = BulletControl; // Player's projectile controller
    this.Lives = lives; // Player's life controller

    // Player dimensions that will be used to draw the Player sprite on the canvas
    this.width = 30; // default 40
    this.height = 50; // default 20

    // Starting point of Player sprite
    this.xPosition = (CANVAS.WIDTH - this.width) / 2;
    this.yPosition = (CANVAS.HEIGHT - this.height) / 1.1;

    // determines how far Player will move on each key press (must be a positive value)
    this.movementSpeed = 5;

    // checks for Player movement state and shooting state
    this.rightPressed = false;
    this.leftPressed = false;
    this.shooting = false;

    // Player sprite to be drawn from a spritesheet
    this.imageSrc = "./images/ezstudentFront.png";
    this.sprite = new Image();
    this.sprite.src = this.imageSrc;

    // event listeners for keyboard events
    // need to pass event param if we are acting based on keyboard actions
    document.addEventListener("keydown", (event) => this.keyDownHandler(event));
    document.addEventListener("keyup", (event) => this.keyUpHandler(event));

    // method instance binding to avoid reference errors to 'this'
    this.drawPlayer = this.drawPlayer.bind(this);
    this.movePlayer = this.movePlayer.bind(this);
    this.shoot = this.shoot.bind(this);
    this.keyDownHandler = this.keyDownHandler.bind(this);
    this.keyUpHandler = this.keyUpHandler.bind(this);
    this.removePlayerEvents = this.removePlayerEvents.bind(this);
    this.getTopEdge = this.getTopEdge.bind(this);
    this.getBottomEdge = this.getBottomEdge.bind(this);
    this.getRightEdge = this.getRightEdge.bind(this);
    this.getLeftEdge = this.getLeftEdge.bind(this);
  }

  /**
   * @file Player.js
   * @method drawPlayer()
   * @references
   * @description this method will be called continously to draw the Player sprite when the canvas itself
   *              is redrawn as the game runs.
   * @function
   *    - Draws the Player sprite on the canvas using 2D context
   *    - Calls this.movePlayer() to listen for signal for Player movement
   *    - Calls this.shoot(canvContext) to listen for signal for Player to shoot projectile
   * @param {CanvasRenderingContext2D} canvContext - Canvas 2D Rendering Context
   * @returns none
   */
  drawPlayer(canvContext) {
    this.imageSrc = "./images/ezstudentFront.png"; // Player sprite's idle state image
    this.sprite.src = this.imageSrc;
    // drawImage() takes an image and scales it to the size of the Player sprite
    // params = src image, x and y position on canvas, width and height of image to draw
    this.movePlayer();
    this.shoot(canvContext);
    canvContext.drawImage(this.sprite, this.xPosition, this.yPosition, this.width, this.height);
  }

  /**
   * @file Player.js
   * @method movePlayer()
   * @description Move the Player sprite a predetermined distance on the horizontal plane
   * @function
   *    - Check condition whether Player sprite is set to move left or move right
   *    - If moving right, add a predetermined number of pixels to the Player sprite's X-position
   *    - Else if moving left, subtract a predetermined number of pixels from the X-position
   *    - Keeps the Player within the bounds of the canvas
   * @param none
   * @returns none
   */
  movePlayer() {
    if (this.rightPressed && this.xPosition < CANVAS.WIDTH - (PADDING.SIDE + this.width)) {
      this.xPosition += this.movementSpeed; // moves the Player to the right
    } else if (this.leftPressed && this.xPosition > PADDING.SIDE) {
      this.xPosition -= this.movementSpeed; // moves the Player to the left
    }
  }

  /**
   * @todo REMOVE THE HIT PARAMETER (DONE by Michael saw and understood that it was useless)
   *
   * @file Player.js
   * @method shoot()
   * @description this method will handle the Player sprite shooting projectiles
   * @function
   *    - If event to shoot a Player projectile is fired, then create a bullet using the Bullet Controller
   *    - After creating the bullet, use the Bullet Controller to shoot the projectile
   * @param {CanvasRenderingContext2D} canvContext - Canvas 2D Rendering Context
   * @returns none
   */
  shoot(canvContext) {
    if (this.shooting) {
      this.imageSrc = "./images/ezstudentBack.png"; // Player sprite's shooting state image
      this.sprite.src = this.imageSrc;

      /*
       * To help calcualte reload time
       * the game is currently running 1 frame persecond
       * 1000/60 = 16.666666667
       * delay is 39
       * 39 / (1000/60)  = 2.34  about 2.3 or 2 second delay
       */
      // this **creates** the bullet
      const speed = 5; // speed at which the projectile will travel (pixels)
      const delay = 39; // duration before Player is able to shoot another projectile
      const bullet_x = this.xPosition + this.width / 2; // center the projectile in the middle of the Player sprite
      const bullet_y = this.yPosition - this.height; // position projectile right above the Player sprite's top edge
      this.BulletControl.shoot(bullet_x, bullet_y, speed, delay, "player"); // create the projectile
    }
    this.BulletControl.draw(canvContext); // shoots the projectile
  }

  /**
   * @file Player.js
   * @method updatePlayerImage()
   * @description change the image of the Player sprite
   * @function
   *    -
   * @param {*} event
   */

  /* -------------------------- EVENT HANDLERS -------------------------- */

  /**
   * @todo REFACTOR PLAYER LIVES AND REMOVE 'P' AND 'O' KEY EVENTS
   *
   * @file Player.js
   * @method keyDownHandler(event)
   * @description handle Player's movement state, shooting state, and damaged state
   * @function
   *    - If Right Arrow Key pressed = the Player will move to the right
   *    - If Left Arrow Key pressed = the Player will move to the left
   *    - If V key is pressed = the Player will shoot projectiles
   *    - If P key is pressed = the Player will gain one life (FOR TESTING ONLY - WILL BE REMOVED)
   *    - If O key is pressed = the Player will lose one life (FOR TESTING ONLY - WILL BE REMOVED)
   * @param {KeyboardEvent} event - keyboard key press
   * @returns none
   */
  keyDownHandler(event) {
    // console.log(event.key);
    if (event.key === "ArrowRight" || event.key === "Right") {
      this.rightPressed = true;
    } else if (event.key === "ArrowLeft" || event.key === "Left") {
      this.leftPressed = true;
    }

    if (event.key.match(/v/i)) {
      this.shooting = true;
    }

    if (event.key === "p") {
      //health
      this.Lives.healthModifier(1); //negative for taking damage, positive for adding health
    }

    if (event.key === "o") {
      //dammage
      this.Lives.healthModifier(-1); //negative for taking damage, positive for adding health
    }
  }

  /**
   * @file Player.js
   * @method keyUpHandler(event)
   * @description handles Player sprite's idle state
   * @function
   *    - If Right Arrow Key unpressed = the Player sprite will stop moving right
   *    - If Left Arrow Key unpressed = the Player sprite will stop moving left
   *    - If V key unpressed = the Player sprite will not shoot
   *    - Player sprite will be in the idle state with not actions
   * @param {KeyboardEvent} event - keyboard key press
   * @returns none
   */
  keyUpHandler(event) {
    // console.log(event.key);
    if (event.key === "ArrowRight" || event.key === "Right") {
      this.rightPressed = false;
      //console.log("releasing right arrow key")
      //console.log("value after release", this.rightPressed);
    } else if (event.key === "ArrowLeft" || event.key === "Left") {
      this.leftPressed = false;
      //console.log("releasing left arrow key")
    } else if (event.key.match(/v/i)) {
      this.shooting = false;
    }
  }

  /**
   * @file Player.js
   * @method removePlayerEvents()
   * @description method to remove event listeners associated with the Player
   * @function
   *    - remove the event listeners from the document object
   * @param none
   * @returns none
   */
  removePlayerEvents() {
    document.addRemoveListener("keydown", (event) => this.keyDownHandler(event));
    document.addRemoveListener("keyup", (event) => this.keyUpHandler(event));
  }

  /* -------------------------- GETTERS -------------------------- */

  /**
   * @file Player.js
   * @method getBottomEdge()
   * @description gets the specific pixel Y-position on the canvas for the Player sprite's bottom edge
   * @function
   *    - Calculates Player sprite's top left corner Y-value + Player sprite's height
   *    - Retrieve the Y-position of the bottom left corner of the Player sprite
   * @param none
   * @returns {Number} the Player sprite's bottom edge Y-position (pixel units)
   */
  getBottomEdge() {
    return this.yPosition + this.height;
  }

  /**
   * @file Player.js
   * @method getTopEdge()
   * @description gets the specific pixel Y-position on the canvas for the Player sprite's top edge
   * @function
   *    - Retrieve the Player sprite's top left corner Y-value
   * @param none
   * @returns {Number} the Player sprite's top edge Y-position (pixel units)
   */
  getTopEdge() {
    return this.yPosition;
  }

  /**
   * @file Player.js
   * @method getRightEdge()
   * @description gets the specific pixel X-position on the canvas for the Player sprite's right edge
   * @function
   *    - Calculates Player sprite's top left corner X-value + Player sprite's width
   *    - Retrieve the X-position of the top right corner of the Player sprite
   * @param none
   * @returns {Number} the Player sprite's right edge X-position (pixel units)
   */
  getRightEdge() {
    return this.xPosition + this.width;
  }

  /**
   * @file Player.js
   * @method getLeftEdge()
   * @description gets the specific pixel X-position on the canvas for the Player sprite's left edge
   * @function
   *    - Retrieve the Player sprite's top left corner X-value
   * @param none
   * @returns {Number} the Player sprite's left edge X-position (pixel units)
   */
  getLeftEdge() {
    return this.xPosition;
  }
}

export default Player;
