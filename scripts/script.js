/**
 * @todo SEARCH FOR '@todo' TO SEE ITEMS THAT STILL NEED TO BE WORKED ON
 *
 * @file script.js
 * @description script.js serves as the entry point for the game
 * This file also contains logic to handle collisions between the three drawn entities.
 * This file contains runs code for the different States of the Game
 *
 * All Components to be drawn on the canvas must go through the startGame() method.
 *
 */

import Player from "./Player.js";
import Lives from "./Lives.js";
import Score from "./Scoreboard.js";
import BulletControl from "./BulletControl.js";
import EnemyGridController from "./enemy/EnemyGridController.js";
import Menu from "./menu/Menu.js";

import { CANVAS, SCORE_DISPLAY } from "./ui/uiConstants.js";
import { GAME_STATE } from "./gameLogic/gameState.js"; // {MENU, RUNNING, GAME_OVER}

/* The initial state should be MENU but currently set to RUNNING for testing the actual game */
let gameState = GAME_STATE.MENU; // set the initial state of the Game
let trueHighscore = 0; 
/**
 * Image to be used for the games background.
 * can change the dim whenever
 */

const BACKGROUND = new Image(0,0);
BACKGROUND.src =  "./images/dim40Background.png";


const Bulletcon = new BulletControl(CANVAS);
const enemyProjectileController = new BulletControl(CANVAS);

const health = new Lives(CANVAS);
const player = new Player(Bulletcon, health);
const scoreboard = new Score(CANVAS, health, trueHighscore);

const enemyGridController = new EnemyGridController();
enemyGridController.createEnemies(); // create the Enemy Grid

// Menu Screen object
const menu = new Menu(player);

//function to check lives and end the game the same way if enemies reach bottom
function checkHealth(menuHandler) {
  let currentHP = health.getCurrenthp();
  if (currentHP === 0) {
    gameState = GAME_STATE.GAME_OVER;
    menuHandler.setupGameOverMenuScreen(); // setup to display the Game Over screen
  }
}

// starts a new wave of enemies when the current grid is empty
function createNewEnemyWave(
  enemyGridController,
  playerProjectileController,
  enemyProjectileController
) {
  enemyGridController.createEnemies(); // create new grid of Enemies
  // remove all Player and Enemy projectiles from the screen to prevent bugs where
  // projectile will hit the new wave right when they appear on the screen.
  playerProjectileController.clearBullets();
  enemyProjectileController.clearBullets();
}

function drawGameUiComponents(scoreboard, health) {
  scoreboard.drawScoreboard(CANVAS.CONTEXT, SCORE_DISPLAY.X_POS, SCORE_DISPLAY.Y_POS);
  health.drawLives(CANVAS.CONTEXT);
}

function drawCanvas() {
  CANVAS.CONTEXT.lineWidth = 4;
  // the programs job here is to display the backgorund within the Canvas's height and width
  //the CANVAS.WIDTH and CANVAS.HEIGHT blows the image up to mathh the canvas border 
  CANVAS.CONTEXT.drawImage(BACKGROUND,0,0, CANVAS.WIDTH, CANVAS.HEIGHT);
}

/**
 * @file script.js
 * @method startGame()
 * @description this function will serve as the entry point for the game
 * @function
 *    - This method will run approximately 60 frames per second
 *    - Switch statement to handle different States of the Game (MENU, RUNNING, GAME OVER)
 *    - The first line of this method will be to redraw the Canvas
 * @returns 
 */
function startGame() {
  // redraw canvas backdrop on each frame
  drawCanvas();

  // Run code based on which State of the Game User is currently in
  switch (gameState) {
    case GAME_STATE.MENU: // User is on the Menu Screen
      menu.draw(); // draw the current selected Menu Option
      if (menu.hasGameStarted()) {
        gameState = GAME_STATE.RUNNING;
        createNewEnemyWave(enemyGridController, Bulletcon, enemyProjectileController);
      }
      break;

    case GAME_STATE.RUNNING: // Game is currently being played
      // draw enemies, draw player, draw bullets
      drawGameUiComponents(scoreboard, health);
      player.drawPlayer(CANVAS.CONTEXT);

      // if no enemies are alive, create a new wave of enemies
      if (!enemyGridController.anyEnemiesAlive()) {
        createNewEnemyWave(enemyGridController, Bulletcon, enemyProjectileController);
        return; // goes to next frame = re-call the startGame() method
      } else {
        enemyGridController.draw(enemyProjectileController);
      }

      // checks for collisions between entities and projectiles (Enemy and Player)
      checkForCollisions();

      //a method to check the Player's health
      checkHealth(menu);

      // If an enemy has crossed into the Player area = Game Over
      if (enemyGridController.checkIfEnemyMovesPastPlayer()) {
        gameState = GAME_STATE.GAME_OVER; // update the state of the Game to end
        menu.setupGameOverMenuScreen(); // setup to display the Game Over screen
      }

      break;

    case GAME_STATE.GAME_OVER: // Game has ended
      // draw "Game Over" screen
      menu.draw(() =>
        // function to draw the score and the highscore
        scoreboard.drawScoreboard(CANVAS.CONTEXT, CANVAS.WIDTH / 2, CANVAS.HEIGHT / 2.5) 
      );

      /**
       * @todo: Display the Player's score on the 'Gamve Over' screen
       */

      if(scoreboard.score > trueHighscore)
      {
        trueHighscore = scoreboard.score;
      }
      
      // check if the User has chosen to Play Again
      if (menu.toPlayAgain()) {
        gameState = GAME_STATE.MENU;
        health.resetHp();
        scoreboard.resetScore();
      }
      break;

    default: // Entered unknown Game State
      console.log("Error: How did I get here?");
      break;
  }
}

/* ------------------- COLLISIONS ------------------- */

function checkForCollisions() {
  searchForCollisions(enemyProjectileController, playerCollisionHandler); // Enemy Projectiles and Player collisions
  searchForCollisions(Bulletcon, enemyCollisionHandler); // Player projectiles and Enemies collision
}

function searchForCollisions(projectileController, collisionHandler) {
  const projectiles = projectileController.getBulletInfo();
  if (projectiles.length) {
    // if any projectiles exist
    projectiles.forEach((projectile) => {
      collisionHandler(projectile);
    });
  }
}

function enemyCollisionHandler(projectile) {
  enemyGridController.getEnemyGrid().forEach((enemyRow, rowIndex, enemyGrid) => {
    enemyRow.forEach((enemy, index) => {
      if (enemy) {
        // compare enemy projectile edges against player edges for overlapping areas
        // if projectile hits Enemy, destroy Enemy, destroy projectile, update score
        if (collisionDetected(enemy, projectile)) {
          console.log("Enemy was hit");

          // destroy projectile on Enemy collision
          Bulletcon.destroyBullet(projectile);

          // destroy the Enemy that was hit by Player projectile
          enemyGrid[rowIndex][index] = false; // indicate the Enemy was destroyed in the 2d grid

          // update Player score a predetermined amount
          scoreboard.addToScore(250);
        }
      }
    });
  });
}

function playerCollisionHandler(projectile) {
  // compare Player projectile edges against all Enemy edges for overlapping areas
  // if projectile hits Player, decrease Player lives by 1, destroy projectile
  if (collisionDetected(player, projectile)) {
    console.log("Player was hit");

    // destroy projectile that collided with Player sprite
    enemyProjectileController.destroyBullet(projectile);

    // decrement Player's health
    health.healthModifier(-1);
  }
}

function collisionDetected(sprite, projectile) {
  const spriteTop = sprite.getTopEdge();
  const spriteBottom = sprite.getBottomEdge();
  const spriteRight = sprite.getRightEdge();
  const spriteLeft = sprite.getLeftEdge();

  const projectileTop = projectile.getTopEdge();
  const projectileBottom = projectile.getBottomEdge();
  const projectileRight = projectile.getRightEdge();
  const projectileLeft = projectile.getLeftEdge();

  // collision detected if all are conditions are false
  // no collision if at least ONE condition is true
  if (
    projectileBottom <= spriteTop || // projectile above the Enemy OR projectile above the Player
    projectileTop >= spriteBottom || // projectile under the Enemy OR projectile under the Player
    projectileLeft >= spriteRight || // projectile right of Enemy OR projectile right of Player
    projectileRight <= spriteLeft // projectile left of Enemy OR projectile left of Player
  ) {
    return false;
  } else {
    return true;
  }
}

//repeatedly calls a function or executes a code snippet, with a fixed time delay between each call calling the function 60 times a second the delay is in miliseconds, 1000 miliseconds is 1 second.
setInterval(startGame, 1000 / 60);
