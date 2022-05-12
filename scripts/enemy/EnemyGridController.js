/**
 * @todo SEARCH FOR '@todo' TO SEE ITEMS THAT STILL NEED TO BE WORKED ON
 *
 * @file EnemyGridController.js
 * @description EnemyGridController class will be responsible for defining methods to create the Grid of Enemies
 * based on predetermined values for the Grid rows and columns. This class also defines methods to retreive
 * isolated parts of the Enemy Grid inclduing the Left-most column, Right-most column, and the Bottom-most row of
 * Enemies.
 *
 * This class will also define methods to clear empty rows and empty columns in the Grid as well as remove
 * individual Enemies that have been destroyed by the Player projectile
 *
 */

import Enemy from "../Enemy.js";
import { GRID_SIZE, GRID_SPACING } from "./enemyConstants.js";
import { CANVAS, PADDING } from "../ui/uiConstants.js";

class EnemyGridController {
  /**
   * @constructor
   * @param none
   */
  constructor() {
    this.enemyGrid = [];

    this.draw = this.draw.bind(this);
    this.move = this.move.bind(this);
    this.shoot = this.shoot.bind(this);
    this.createEnemies = this.createEnemies.bind(this);
    this.changeEnemyDirection = this.changeEnemyDirection.bind(this);
    this.checkIfEnemyMovesPastPlayer = this.checkIfEnemyMovesPastPlayer.bind(this);
    this.findLeftMostEnemies = this.findLeftMostEnemies.bind(this);
    this.findRightMostEnemies = this.findRightMostEnemies.bind(this);
    this.findBottomMostEnemies = this.findBottomMostEnemies.bind(this);
    this.clearEnemyGridRows = this.clearEnemyGridRows.bind(this);
    this.clearEnemyGridColumns = this.clearEnemyGridColumns.bind(this);
    this.anyEnemiesAlive = this.anyEnemiesAlive.bind(this);
    this.getEnemyGrid = this.getEnemyGrid.bind(this);
  }

  /**
   * @file EnemyGridController.js
   * @method createEnemies()
   * @description this method will be called to instantiate the Enemy Grid
   * @function
   *    - Create a 2D-Array of Enemy objects with given rows and given columns
   *    - Enemy positioning on the Enemy Grid will be based on given padding and canvas dimensions
   *    - Update the this.enemyGrid with the newly created grid
   * @param none
   * @returns {Enemy[][]} 2D-Array: the newly created Enemy Grid
   */
  createEnemies() {
    this.enemyGrid.length = 0; // clear the current Enemy grid
    for (let i = 1; i <= GRID_SIZE.ROWS; i++) {
      const enemyRow = [];
      for (let j = 1; j <= GRID_SIZE.COLUMNS; j++) {
        const xOffset = PADDING.SIDE + GRID_SPACING.HORIZONTAL * j; // horizontal space between adjacent enemies
        const yOffset = GRID_SPACING.VERTICAL * i; // vertical space between enemies

        // create the Enemy object and add to the current enemy row
        const enemy = new Enemy(CANVAS.WIDTH, CANVAS.HEIGHT, xOffset, yOffset);

        // add the newly created Enemy to the current Enemy Row
        enemyRow.push(enemy);
      }

      // add the newly filled Enemy Row into the Enemy Grid
      this.enemyGrid.push(enemyRow);
    }

    // returns the current Enemy Grid if it was not empty
    // returns the newly created Enemy Grid if the current Grid was empty
    return this.enemyGrid;
  }

  /**
   * @file EnemyGridController.js
   * @method draw()
   * @description draw the entire Enemy Grid on the canvas
   * @function
   *    - This method will be called continuously as the game continues running
   *    - Iterate through each Enemy Object in the Grid and call the Enemy's draw method
   *    - Periodically clear Empty rows and empty columns
   *    - Check if the Grid is empty after clearing the empty rows and columns
   *    - Call to move() to handle Enemy movement
   *    - Call to shoot() to handle Enemy projectiles
   * @param none
   * @returns none
   */
  draw(enemyProjectileController) {
    // draw each Enemy that still exists
    this.enemyGrid.forEach((enemyRow) => {
      enemyRow.forEach((enemy) => {
        if (enemy) {
          enemy.draw(CANVAS.CONTEXT);
        }
      });
    });

    // clear empty rows and columns
    this.clearEnemyGridRows();
    this.clearEnemyGridColumns();

    // check if Enemy Grid is empty after clearing the empty Rows and Columns
    // if empty, we should not move or shoot anything
    if (this.anyEnemiesAlive()) {
      this.move(); // handles Enemy Grid movement
      this.shoot(enemyProjectileController); // handles shooting Enemy projectiles
    }
  }

  /**
   * @file EnemyGridController.js
   * @method shoot()
   * @description handles shooting Enemy Projectiles
   * @function
   *    - This method will be called continuously as the game continues running
   *    - Retrieve the bottom-most Enemies of each column in the Enemy Grid
   *    - Each bottom Enemy will shoot a projectile downward handled by the EnemyProjectileController
   * @param {BulletControl} enemyProjectileController - Controller instance to manage Enemy projectiles
   * @returns none
   */
  shoot(enemyProjectileController) {
    const bottomMostEnemies = this.findBottomMostEnemies(); // find the Enemies on the bottom row of the Grid

    // have the bottom-most Enemies shoot projectiles at the Player
    if (bottomMostEnemies.length) {
      bottomMostEnemies.forEach((enemy) => {
        if (enemy) {
          const enemyCenter = enemy.getMiddlePosition(); // center of enemy sprite
          const enemyFront = enemy.getBottomEdge(); // position in front of the enemy sprite
          const randomDelay = Math.floor(Math.random()* 500);
          const enemyProjSpeed = -3; // should be negative to allow bullets to go down
          enemyProjectileController.shoot(
            enemyCenter,
            enemyFront,
            enemyProjSpeed,
            randomDelay,
            "enemy_1" // enemy type incase for future enemies to shoot different projectiles 
          );
        }
      });
    }
    enemyProjectileController.draw(CANVAS.CONTEXT); // shoot all the Enemy projectiles
  }

  /**
   * @file EnemyGridController.js
   * @method move()
   * @description handles movement of the Enemy Grid
   * @function
   *    - This method will be called continuously as the game continues running
   *    - Retrieve the left-most Enemies and the right-most Enemies
   *    - Check if the left-most Enemies have hit the left bound, if so change direction to right
   *    - Check if the right-most Enemies have hit the right bound, if so change direction to left
   * @param none
   * @returns none
   */
  move() {
    const leftMostEnemies = this.findLeftMostEnemies(); // find the Enemies on the left side of the Grid
    const rightMostEnemies = this.findRightMostEnemies(); // find the Enemies on the right side of the Grid

    // check if the Enemy Grid has hit the left boundary or the right boundary and bounce in the opposite direction
    if (leftMostEnemies.length) {
      // check if any Enemies
      if (leftMostEnemies[0].getLeftEdge() <= PADDING.SIDE) {
        this.changeEnemyDirection(true); // if left bound hit, make Enemies go right
      }
    }

    if (rightMostEnemies.length) {
      // check if any Enemies
      if (rightMostEnemies[0].getRightEdge() >= CANVAS.WIDTH - PADDING.SIDE) {
        this.changeEnemyDirection(false); // if right bound hit, make Enemies go left
      }
    }
  }

  /**
   * @file EnemyGridController.js
   * @method changeEnemyDirection()
   * @description reverses the movement direction of each Enemy in the Enemy Grid and moves each
   * Enemy down a predetermined distance.
   * @function
   *    - Check if the Enemy is moving right --> change to move left
   *    - Check if the Enemy is moving left --> change to move right
   *    - Move the enemy down
   * @param {boolean} toGoRight - flag to indicate if the enemy was moving right or left
   * @returns {boolean} true if the game is over, false otherwise
   */
  changeEnemyDirection(toGoRight) {
    this.enemyGrid.forEach((enemyRow) => {
      enemyRow.forEach((enemy) => {
        // check if the enemy exists
        if (enemy) {
          if (toGoRight === true) {
            enemy.setDirectionRight(); // bounce off left wall and move right
          } else {
            enemy.setDirectionLeft(); // bounce off right wall and move left
          }
          enemy.moveDown(); // move enemy down
        }
      });
    });
  }

  /**
   * @file EnemyGridController.js
   * @method checkIfEnemyMovesPastPlayer()
   * @description determine if any Enemy has invaded the Player area resulting in a Game Over
   * @function
   *    - Check if any Enemies still exist
   *    - Iterate over the last row of Enemies in the Enemy Grid
   *    - Check each Enemy's bottom X and Y coordinates to see if they have moved into the
   *      Player space threshhold
   * @param none
   * @returns {boolean} true if an Enemy's (from the bottom row of the grid) bottom edge
   *                    moves past the Player space boundary, false otherwise
   */
  checkIfEnemyMovesPastPlayer() {
    // if any Enemies alive, check if an Enemy has crossed the Player Area threshhold
    if (this.anyEnemiesAlive()) {
      const playerSpace = CANVAS.HEIGHT - PADDING.BOTTOM;
      const bottomRow = this.enemyGrid[this.enemyGrid.length - 1];
      for (let i = 0; i < bottomRow.length; i++) {
        const enemy = bottomRow[i];
        if (enemy) {
          if (enemy.getBottomEdge() > playerSpace) {
            return true;
          }
        }
      }
    }

    return false;
  }

  /* -------------------------- GRID RETRIEVALS -------------------------- */

  /**
   * @file EnemyGridController.js
   * @method findLeftMostEnemies()
   * @description find the Enemy in each row that is farthest to the Left side of the grid.
   * This method is used for determining when the Enemy Grid should change direction from left to right
   * @function
   *    - This method does not modify the original Enemy Grid
   *    - Iterate through each row and append the first Enemy (if it exists) in the row to a new list
   * @param none
   * @returns {Enemy[]} 1D-Array: List of all existing enemies on the left edge of the Enemy Grid
   */
  findLeftMostEnemies() {
    const leftEnemies = [];
    for (let row = 0; row < this.enemyGrid.length; row++) {
      const enemy = this.enemyGrid[row][0];
      // if the enemy exists add it to the list of left-most enemies
      // ordering does not matter, list does not need to equal length of entire column
      if (enemy) {
        leftEnemies.push(enemy);
      }
    }

    return leftEnemies;
  }

  /**
   * @file EnemyGridController.js
   * @method findRightMostEnemies()
   * @description find the Enemy in each row that is farthest to the right side of the grid.
   * This method is used for determining when the Enemy Grid should change direction from right to left
   * @function
   *    - This method does not modify the original Enemy Grid
   *    - Iterate through each row and append the last Enemy (if it exists) in the row to a new list
   * @param none
   * @returns {Enemy[]} 1D-Array: List of all existing enemies on the right edge of the Enemy Grid
   */
  findRightMostEnemies() {
    const rightEnemies = [];
    for (let row = 0; row < this.enemyGrid.length; row++) {
      const lastColIndex = this.enemyGrid[row].length - 1;
      const enemy = this.enemyGrid[row][lastColIndex];
      // if enemy exists add to the list of right-most enemies
      // ordering does not matter, list does not need to equal length of entire column
      if (enemy) {
        rightEnemies.push(enemy);
      }
    }

    return rightEnemies;
  }

  /**
   * @file EnemyGridController.js
   * @method findBottomMostEnemies()
   * @description find the Enemy in each column that is at the bottom of the Grid.
   * This method is used for determining which Enemies in the Grid are currently able to shoot projectiles
   * @function
   *    - This method does not modify the original Enemy Grid
   *    - Iterate through each column and append the last Enemy (if it exists) in the column to a new list
   * @param none
   * @returns {Enemy[]} 1D-Array: List of all existing enemies on the bottom of the Enemy Grid
   */
  findBottomMostEnemies() {
    const bottomEnemies = [];
    const bottomRowIndex = this.enemyGrid.length - 1;
    const bottomRow = this.enemyGrid[bottomRowIndex]; // get the bottom-most row of Enemies

    // iterate over the bottom-most row on the Enemy Grid
    for (let col = 0; col < bottomRow.length; col++) {
      const enemy = bottomRow[col];
      // if the enemy exists, add to list of bottom enemies
      if (enemy) {
        bottomEnemies.push(enemy);
      } else {
        // if Enemy in bottom row does not exist,
        // then search upwards for the next living Enemy
        for (let row = bottomRowIndex - 1; row >= 0; row--) {
          const nextEnemy = this.enemyGrid[row][col];
          if (nextEnemy) {
            // check if next Enemy upward exists
            bottomEnemies.push(nextEnemy);
            break; // only need the first occurence of the next living Enemy
          }
        }
      }
    }

    return bottomEnemies;
  }

  /* -------------------------- GRID MODIFIERS -------------------------- */

  /**
   * @file EnemyGridController.js
   * @method clearEnemyGridRows()
   * @description removes the bottom row of the Enemy Grid if the row is completely empty
   * @function
   *    - This method will modify the original Enemy Grid
   *    - This method will be called continuously
   *    - A {boolean} false value will be at the index position of an Enemy that was destroyed
   *    - Check if any of the values on the bottom row are not false
   *    - Do nothing if any value in the bottom row is not false, else remove the row from the Grid
   * @param none
   * @returns {boolean} true if all Enemies on the bottom row were destroyed (all values are false)
   *                    false if any Enemy still exists on the bottom-most row of the Enemy Grid,
   *
   */
  clearEnemyGridRows() {
    const bottomRowIndex = this.enemyGrid.length - 1;
    for (let col = 0; col < this.enemyGrid[bottomRowIndex].length; col++) {
      const enemy = this.enemyGrid[bottomRowIndex][col];
      // if at least one enemy exists on the bottom row, do nothing
      if (enemy) {
        return false;
      }
    }

    this.enemyGrid.pop(); // remove the last row of the Enemy Grid
    return true;
  }

  /**
   *
   * @todo can likely be optimized as it performs redundant checks, but because the grid size
   * is predetermined and is a relatively small value (< 100), will not be a priority to change
   *
   * @file EnemyGridController.js
   * @method clearEnemyGridColumns()
   * @description removes any and all empty columns from the Enemy Grid
   * @function
   *    - This method will modify the original Enemy Grid
   *    - This method will be called continuously
   *    - A {boolean} false value will be at the index position of an Enemy that was destroyed
   *    - Looks through each Enemy in the Grid and updates a tracker array that tracks the number
   *      of Enemies in each column of the Enemy Grid
   *    - Each enemy that exists will increment the corresponding index in the tracker array
   *    - Any 0 values present in the tracker array indicates an empty column and will be removed
   *      by iterating through each row and removing the element at the corresponding empty index
   * @param none
   * @returns {boolean} true if any column was removed from the Enemy Grid
   *                    false if no columns were removed from the Enemy Grid
   *
   */
  clearEnemyGridColumns() {
    let anyColumnsRemoved = false;
    // make an array of size equal to enemy grid columns, values all set to 0
    const emptyColumnIndexes = new Array(GRID_SIZE.COLUMNS).fill(0);

    // need to check through entire grid to know if there is an empty column
    for (let row = 0; row < this.enemyGrid.length; row++) {
      for (let col = 0; col < this.enemyGrid[row].length; col++) {
        const isEnemyAlive = this.enemyGrid[row][col];
        // if enemy exists, we know that the column is not empty
        if (isEnemyAlive) {
          emptyColumnIndexes[col]++; // increment the corresponding index
        }
      }
    }

    // go through array of column indices
    // if value = 0, then the column denoted by the array index is completely empty
    for (let colIdx = 0; colIdx < emptyColumnIndexes.length; colIdx++) {
      const isNotEmpty = emptyColumnIndexes[colIdx];
      // if the column is empty, iterate through each row and remove the empty index in that row
      if (!isNotEmpty) {
        // value of 0 is falsey (will equate to false)
        anyColumnsRemoved = true;
        for (let row = 0; row < this.enemyGrid.length; row++) {
          const enemyRow = this.enemyGrid[row];
          enemyRow.splice(colIdx, 1); // remove element (params: index, number of elements to remove)
        }
      }
    }

    return anyColumnsRemoved;
  }

  /* -------------------------- GETTERS -------------------------- */

  /**
   * @file EnemyGridController.js
   * @method anyEnemiesAlive()
   * @description retrieves the length of the Enemy Grid to determine if the Grid is empty
   * @function
   *    - Getter method to check if the Enemy Grid has length 0 (empty)
   * @param none
   * @returns {number} 0 (false) if Grid is empty
   *                   any value but 0 (true) if Grid is not empty
   */
  anyEnemiesAlive() {
    return this.enemyGrid.length;
  }

  /**
   * @file EnemyGridController.js
   * @method getEnemyGrid()
   * @description retrieves the Enemy Grid
   * @function
   *    - Get the Enemy Grid
   * @param none
   * @returns {Enemy[][]} the Enemy Grid
   */
  getEnemyGrid() {
    return this.enemyGrid;
  }
}

export default EnemyGridController;
