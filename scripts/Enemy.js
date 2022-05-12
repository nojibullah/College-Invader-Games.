/**
 * @todo SEARCH FOR '@todo' TO SEE ITEMS THAT STILL NEED TO BE WORKED ON
 *
 * @file Enemy.js
 * @description The Enemy Class is a schema used to create Enemy Objects.
 * Multiple Enemies will be created to form an Enemy Grid.
 * An Enemy Object is NOT User-controlled, and will perform actions independent of any user-inputs.
 * 
 * This class will define how the Enemy can move and how it will be displayed on the canvas
 * An Enemy can move in two dimensions (horizontal and vertical) but may NOT move upwards
 * An Enemy sprite will move continuously and will never idle.
 * 
 * Enemy Shooting will NOT be handled in the Enemy Class
 * 
 * An Enemy sprite wil be confined to a 40 x 40 pixel space and will be scaled accordingly on the canvas
 *
 */

import { getSpriteDimensions } from "./spriteDimensions.js";

class Enemy {
  /**
   * @constructor
   * @param {Number} canvasWidth - the width of the canvas display
   * @param {Number} canvasHeight - the height of the canvas display
   * @param {Number} xOffset - distance from the first Enemy in the Enemy Row - used to determine the starting position
   * @param {Number} yOffset - distance from the first Enemy in the Enemy Column - used to determine starting position
   */
  constructor(canvasWidth, canvasHeight, xOffset, yOffset) {
    this.canvasWidth = canvasWidth; // width of canvas that Enemy sprite will be drawn on
    this.canvasHeight = canvasHeight; // height of canvas that Enemy sprite will be drawn on

    // Enemy dimensions that will be used to draw the Enemy sprite on the canvas
    this.width = 30; // max 40
    this.height = 40; // max 40

    // Enemy starting positioning based on offsets from adjacent Enemies
    this.xPosition = xOffset;
    this.yPosition = yOffset;

    // Flag to determine if Enemy sprite is moving left or right
    this.isGoingRight = true;

    // Values for Enemy sprite mvoement - both speed values must be positive
    this.horizontalMoveSpeed = 0.3; // how quickly Enemy will move horizontally (pixels)
    this.verticalMoveSpeed = 20; // number of pixels Enemy moves down per cycle (cycle = each bounce off canvas wall)

    // Enemy sprite to be drawn from a spritesheet
    this.sprite = new Image();
    this.sprite.src = "./images/ezteach.png";

    // get the dimensions of each image on the corresponding spritesheet
    // returns an object with the following fields: { spriteWidth, spriteHeight, imageCount }
    this.spriteDimensions = getSpriteDimensions("ezTeach");

    // values used to loop through the images on the spritesheet - simulates the Enemy sprite's animation
    this.spriteImageCount = this.spriteDimensions.imageCount; // retrieve number of images in the spritesheet
    this.frameIndex = 0; // which sprite image in the spritesheet is currently being drawn
    this.frameCount = 0; // counter for how long before moves on to draw the next image in the spritesheet
    this.maxFrameCount = 20; // max count the frameCount can reach before being reset

    // method instance binding to avoid reference errors to 'this'
    this.draw = this.draw.bind(this);
    this.move = this.move.bind(this);
    this.setDirectionRight = this.setDirectionRight.bind(this);
    this.setDirectionLeft = this.setDirectionLeft.bind(this);
    this.getMiddlePosition = this.getMiddlePosition.bind(this);
    this.getBottomEdge = this.getBottomEdge.bind(this);
    this.getTopEdge = this.getTopEdge.bind(this);
    this.getRightEdge = this.getRightEdge.bind(this);
    this.getLeftEdge = this.getLeftEdge.bind(this);
  }

  /**
   * @todo REFACTOR THE SPRITE ANIMATION TO RUN ONLY WHEN THE ENEMY IS SHOOTING A PROJECTILE
   *
   * @file Enemy.js
   * @method draw()
   * @description this method will be called continously to draw the Enemy sprite and the sprite's animation
   *              when the canvas itself is redrawn as the game runs.
   * @function
   *    - Draws the Enemy sprite on the canvas using 2D context
   *    - Simulate a timer to display the Enemy sprite's animation continuously
   *    - Calls move() to move the Enemy sprite horizontally
   * @param {CanvasRenderingContext2D} canvContext - Canvas 2D Rendering Context
   * @returns none
   */
  draw(canvasCtx) {
    // canvas context .drawImage() documentation
    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage
    canvasCtx.drawImage(
      this.sprite, // image source
      this.frameIndex * this.spriteDimensions.spriteWidth, // where to start measuring the width of image to draw
      0, // where to start measuring the height of the image to be drawn
      this.spriteDimensions.spriteWidth, // the width of the image that you want to retain when drawn
      this.spriteDimensions.spriteHeight, // the height of the image that you want to retain when drawn
      this.xPosition, // x position on the canvas
      this.yPosition, // y position on the canvas
      this.width, // will scale down the width of the image on the canvas
      this.height // will scale down the height of the image on the canvas
    );

    // simulate a timer to determine when to switch frames in the Enemy spritesheet
    this.frameCount++;

    // the larger the number, the slower the frame transitions
    // the smaller the number, the faster the animation will run
    if (this.frameCount > this.maxFrameCount) {
      this.frameIndex++;
      this.frameCount = 0;
    }

    // start over from first frame after displaying the last frame in the spritesheet
    if (this.frameIndex > this.spriteImageCount - 1) {
      // zero-indexed - subtract 1 from spriteImageCount
      this.frameIndex = 0;
    }

    this.move();
  }

  /**
   * @file Enemy.js
   * @method move()
   * @description Moves the Enemy sprite across the horizontal plane
   * @function
   *    - Checks flag to see if enemy is moving right
   *    - If enemy is moving right, add a predetermined number of pixels to the Enemy sprite's X-position
   *    - Else if enemy is not moving right (moving left), subtract the predetermined number of pixels from X-position
   *    - Enemy does not have an idle state, and will be moving continuously without User control
   * @param none
   * @returns none
   */
  move() {
    if (this.isGoingRight === true) {
      this.xPosition += this.horizontalMoveSpeed;
    } else {
      this.xPosition -= this.horizontalMoveSpeed;
    }
  }

  /**
   * @file Enemy.js
   * @method moveDown()
   * @description Moves the Enemy sprite down the canvas
   * @function
   *    - Sets the Enemy sprite's Y-position after moving down a predetermined number of pixels
   *    - Adding a positive value to the Enemy sprite's Y-position will move it down the canvas
   *    - Enemy sprite should only be able to move down, NOT up
   * @param none
   * @returns none
   */
  moveDown() {
    if (this.verticalMoveSpeed > 0) {
      this.yPosition += this.verticalMoveSpeed;
    }
  }

  /* -------------------------- SETTERS -------------------------- */

  /**
   * @file Enemy.js
   * @method setDirectionRight()
   * @description changes the Enemy's movement direction to the right
   * @function
   *    - Sets a flag to indicate that the Enemy will now move to the right
   * @param none
   * @returns none
   */
  setDirectionRight() {
    this.isGoingRight = true;
  }

  /**
   * @file Enemy.js
   * @method setDirectionLeft()
   * @description changes the Enemy's movement direction to the left
   * @function
   *    - Sets a flag to indicate that the Enemy will now move to the left
   * @param none
   * @returns none
   */
  setDirectionLeft() {
    this.isGoingRight = false;
  }

  /* -------------------------- GETTERS -------------------------- */

  /**
   * @file Enemy.js
   * @method getBottomEdge()
   * @description gets the specific pixel Y-position on the canvas for the Enemy sprite's bottom edge
   * @function
   *    - Calculates Enemy sprite's top left corner Y-value + Enemy sprite's height
   *    - Retrieve the Y-position of the bottom left corner of the Enemy sprite
   * @param none
   * @returns {Number} the Enemy sprite's bottom edge Y-position (pixel units)
   */
  getMiddlePosition() {
    return this.xPosition + this.width / 2;
  }

  /**
   * @file Enemy.js
   * @method getBottomEdge()
   * @description gets the specific pixel Y-position on the canvas for the Enemy sprite's bottom edge
   * @function
   *    - Calculates Enemy sprite's top left corner Y-value + Enemy sprite's height
   *    - Retrieve the Y-position of the bottom left corner of the Enemy sprite
   * @param none
   * @returns {Number} the Enemy sprite's bottom edge Y-position (pixel units)
   */
  getBottomEdge() {
    return this.yPosition + this.height;
  }

  /**
   * @file Enemy.js
   * @method getTopEdge()
   * @description gets the specific pixel Y-position on the canvas for the Enemy sprite's top edge
   * @function
   *    - Retrieve the Enemy sprite's top left corner Y-value
   * @param none
   * @returns {Number} the Enemy sprite's top edge Y-position (pixel units)
   */
  getTopEdge() {
    return this.yPosition;
  }

  /**
   * @file Enemy.js
   * @method getRightEdge()
   * @description gets the specific pixel X-position on the canvas for the Enemy sprite's right edge
   * @function
   *    - Calculates Enemy sprite's top left corner X-value + Enemy sprite's width
   *    - Retrieve the X-position of the top right corner of the Enemy sprite
   * @param none
   * @returns {Number} the Enemy sprite's right edge X-position (pixel units)
   */
  getRightEdge() {
    return this.xPosition + this.width;
  }

  /**
   * @file Enemy.js
   * @method getLeftEdge()
   * @description gets the specific pixel X-position on the canvas for the Enemy sprite's left edge
   * @function
   *    - Retrieve the Enemy sprite's top left corner X-value
   * @param none
   * @returns {Number} the Enemy sprite's left edge X-position (pixel units)
   */
  getLeftEdge() {
    return this.xPosition;
  }
}

export default Enemy;
