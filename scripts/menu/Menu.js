/**
 * @file Menu.js
 * @description This class will be used to define methods to draw the Game's starting Menu
 * Menu will have three options/submenus:
 *    - Play Game (Resume)
 *    - How to Play
 *    - Controls
 * Each submenu option will be drawn as a separate screen using separate draw methods
 *
 * The Main Menu will be used when the Game is first launched and when the Game is paused
 *
 * This class will also define the 'Game Over' screen that has the option to 'Play Again'
 */
import { CANVAS } from "../ui/uiConstants.js";
import {
  MAIN_MENU,
  MENU_OPTIONS,
  INSTRUCTIONS,
  CONTROLS,
  RETURN_TO_MENU_TEXT,
  SELECT_OPTION_TEXT,
  createMenuOverlay,
  PLAY_AGAIN_TEXT,
} from "./menuConstants.js";

class Menu {
  /**
   * @constructor
   * @param none
   */
  constructor(player) {
    this.menuState = "Main Menu"; // track which menu screen is currently being displayed

    // determine location of User's selection cursor on main menu screen
    this.selection = MENU_OPTIONS.PLAY; // defaults the cursor to appear on the 'Play Game' menu option

    // boolean to determine if User selected to Play the Game
    this.playGame = false; // set initial value to false when we are in the menu, true if we are starting the Game

    // boolean to determine if the User wants to play again after reaching the 'Game Over' screen
    this.retry = false;

    // create a dark overlay to place above the background for better text readability
    this.overlay = createMenuOverlay();

    // control instructions for the Player
    this.controlsArrowKeys = new Image();
    this.controlsArrowKeys.src = "../../images/controls/Arrow-buttons.png";
    this.controlVKey = new Image();
    this.controlVKey.src = "../../images/controls/vKey.png";
    this.controlsSamplePlayer = player; // create a Player for the User to test out controls

    // instance method binding
    this.draw = this.draw.bind(this);
    // menu drawing
    this.drawMainMenu = this.drawMainMenu.bind(this);
    this.drawHowToPlayMenu = this.drawHowToPlayMenu.bind(this);
    this.drawControlsMenu = this.drawControlsMenu.bind(this);
    this.drawGameOverMenu = this.drawGameOverMenu.bind(this);
    // helper functions for drawing
    this.drawMainMenuCursor = this.drawMainMenuCursor.bind(this);
    this.findSelectedOption = this.findSelectedOption.bind(this);
    this.drawMenuControlText = this.drawMenuControlText.bind(this);
    this.wordWrap = this.wordWrap.bind(this);
    this.drawOverlay = this.drawOverlay.bind(this);
    // event handlers
    this.keydownHandler = this.keydownHandler.bind(this);
    // setters
    this.changeMenuScreen = this.changeMenuScreen.bind(this);

    // event listener to handle User keyboard input
    document.addEventListener("keydown", (event) => this.keydownHandler(event));
  }

  /* ------------------- MENU DRAWING ------------------- */

  /**
   * @file Menu.js
   * @method draw()
   * @description method to handle drawing of the Menu and different Submenus
   * @function
   *    - This method will be called continuously whenever the Game is in the Menu State
   *    - call method to draw the Menu/Submenu corresponding to the current menuState
   * @param none
   * @returns none
   */
  draw(scoreboard) {
    this.drawOverlay();

    CANVAS.CONTEXT.fillStyle = "white";
    switch (this.menuState) {
      case MENU_OPTIONS.PLAY:
        this.removeMenuEventListeners(); // clear the Menu-specific event listeners before starting the Game
        this.playGame = true; // set value to true to indicate that we are going to Play the Game
        this.retry = false;
        break;
      case MENU_OPTIONS.HOW_TO_PLAY:
        this.drawHowToPlayMenu();
        break;
      case MENU_OPTIONS.CONTROLS:
        this.drawControlsMenu();
        break;
      case MENU_OPTIONS.GAME_OVER:
        this.drawGameOverMenu(scoreboard);
        break;
      default: // default to Main Menu
        this.drawMainMenu();
        break;
    }
  }

  /**
   * @file Menu.js
   * @method drawMainMenu()
   * @description method to draw the Main Menu of the game
   * @function
   *    - Drawing of the Game Title
   *    - Drawing of the different Menu options (submenus)
   * @param none
   * @returns none
   */
  drawMainMenu() {
    // canvas 640px * 480px
    // centers text at the x position provided in the fillText() function
    CANVAS.CONTEXT.textAlign = "center";

    // using fillText() draws the characters above the given (x,y) coordinate - bottom left corner
    // title text, font, positioning
    CANVAS.CONTEXT.font = "60px Arial";
    CANVAS.CONTEXT.fillText(MAIN_MENU.title.text, MAIN_MENU.title.xPos, MAIN_MENU.title.yPos, 400); // 400 = max width

    // submenu text, font, positioning
    CANVAS.CONTEXT.font = `${MENU_OPTIONS.FONT_SIZE}px Arial`;
    CANVAS.CONTEXT.fillText(
      MAIN_MENU.playGame.text,
      MAIN_MENU.playGame.xPos,
      MAIN_MENU.playGame.yPos,
      MENU_OPTIONS.MAX_TEXT_WIDTH
    );

    CANVAS.CONTEXT.fillText(
      MAIN_MENU.howToPlay.text,
      MAIN_MENU.howToPlay.xPos,
      MAIN_MENU.howToPlay.yPos,
      MENU_OPTIONS.MAX_TEXT_WIDTH
    );
    CANVAS.CONTEXT.fillText(
      MAIN_MENU.controls.text,
      MAIN_MENU.controls.xPos,
      MAIN_MENU.controls.yPos,
      MENU_OPTIONS.MAX_TEXT_WIDTH
    );

    this.drawMainMenuCursor();
    this.drawMenuControlText(SELECT_OPTION_TEXT);
  }

  /**
   * @file Menu.js
   * @method drawHowToPlayMenu()
   * @description this method will draw the menu screen when the User selects 'How To Play'
   * @function
   *    - Will draw text instructions on how to play the game
   * @param none
   * @returns none
   */
  drawHowToPlayMenu() {
    this.drawMenuControlText(RETURN_TO_MENU_TEXT);

    CANVAS.CONTEXT.textAlign = "center";
    CANVAS.CONTEXT.font = "60px Arial";
    CANVAS.CONTEXT.fillText(
      MAIN_MENU.howToPlay.text,
      MAIN_MENU.title.xPos,
      MAIN_MENU.title.yPos,
      400
    );

    CANVAS.CONTEXT.textAlign = "start";
    CANVAS.CONTEXT.font = `${INSTRUCTIONS.FONT_SIZE}px Arial`;

    // instruction text will be too long to fit on one line - need to wrap text to paragraph form
    const lines = this.wordWrap(INSTRUCTIONS.text.words); // separate text into lines and draw each line of text
    lines.forEach((line, index) => {
      CANVAS.CONTEXT.fillText(
        line,
        INSTRUCTIONS.text.xPos,
        INSTRUCTIONS.text.yPos + INSTRUCTIONS.FONT_SIZE * index
      );
    });
  }

  /**
   * @file Menu.js
   * @method drawControlsMenu()
   * @description method to draw the Control screen menu
   * @function
   *    - Draw text explaining the different Player controls when the Game is in the Running state
   *    - Draw a Player object to allow the User to test the controls
   * @param none
   * @returns none
   */
  drawControlsMenu() {
    this.drawMenuControlText(RETURN_TO_MENU_TEXT);

    CANVAS.CONTEXT.textAlign = "center";
    CANVAS.CONTEXT.font = "60px Arial";
    CANVAS.CONTEXT.fillText(
      MAIN_MENU.controls.text,
      MAIN_MENU.title.xPos,
      MAIN_MENU.title.yPos,
      400
    );

    CANVAS.CONTEXT.textAlign = "start";
    CANVAS.CONTEXT.font = `${CONTROLS.FONT_SIZE}px Arial`;

    // draw keyboard button images()
    CANVAS.CONTEXT.drawImage(this.controlsArrowKeys, 50, 200, 200, 100);
    CANVAS.CONTEXT.drawImage(this.controlVKey, 400, 200, 50, 50);

    // draw the sample Player for the User to test
    this.controlsSamplePlayer.drawPlayer(CANVAS.CONTEXT);
  }

  /**
   * @file Menu.js
   * @method drawGameOverMenu()
   * @description method to draw the Game Over screen
   * @function
   *    - Draw the "Game Over" text on the screen
   *    - Draw a "Play Again" Button on the screen
   *    - Display the Player's Current score and the previous High Score
   * @param {function} displayScore - to display the Player's score
   * @returns none
   */
  drawGameOverMenu(displayScore) {
    CANVAS.CONTEXT.fillStyle = "white";
    CANVAS.CONTEXT.font = "50px Arial";
    CANVAS.CONTEXT.textAlign = "center";
    CANVAS.CONTEXT.fillText("Game Over", CANVAS.WIDTH / 2, CANVAS.HEIGHT / 3);
    CANVAS.CONTEXT.font = "20px Arial";
    CANVAS.CONTEXT.fillText(
      "Play Again?",
      CANVAS.WIDTH / 2,
      CANVAS.HEIGHT / 1.2,
      MAIN_MENU.MAX_TEXT_WIDTH
    );
    displayScore();

    this.drawMainMenuCursor();
    this.drawMenuControlText(PLAY_AGAIN_TEXT);
  }

  /* ------------------- MENU HELPER DRAWING ------------------- */

  /**
   * @file Menu.js
   * @method drawMainMenuCursor()
   * @description method to draw the User's selection cursor
   * @function
   *    - draw the User's selection cursor on the Main Menu screen
   * @param none
   * @returns none
   */
  drawMainMenuCursor() {
    // find the current selected submenu option
    const selected = this.findSelectedOption();

    // center the cursor outline around the submenu option text
    const cursorWidth = MENU_OPTIONS.MAX_TEXT_WIDTH;
    const cursorHeight = MENU_OPTIONS.FONT_SIZE * 2;
    const cursorX = CANVAS.WIDTH / 2 - cursorWidth / 2;
    const cursorY = selected.yPos - cursorHeight * 0.65;

    // draw the selection cursor
    CANVAS.CONTEXT.strokeStyle = "green";
    CANVAS.CONTEXT.strokeRect(cursorX, cursorY, cursorWidth, cursorHeight);
  }

  /**
   * @file Menu.js
   * @method findSelectedOption()
   * @description method to find out which submenu option the cursor should be drawn around
   * @function
   *    - switch statement to check the current Menu selection state
   *    - get the current selection state's coordinates
   * @param none
   * @returns {object} object containing coordinate fields for the corresponding menu option {xPos: , yPos: }
   */
  findSelectedOption() {
    switch (this.selection) {
      case MENU_OPTIONS.HOW_TO_PLAY:
        return MAIN_MENU.howToPlay;
      case MENU_OPTIONS.CONTROLS:
        return MAIN_MENU.controls;
      case MENU_OPTIONS.GAME_OVER:
        return MAIN_MENU.gameOver;
      default:
        return MAIN_MENU.playGame;
    }
  }

  /**
   * @file Menu.js
   * @method drawMenuControlText()
   * @description method to draw Menu controls to the User depending on which menu screen they are on
   * @function
   *    - draw text near the bottom-left corner of the canvas screen
   *    - actual keyboard inputs will be handled by an event handler
   * @param none
   * @returns none
   */
  drawMenuControlText(text) {
    CANVAS.CONTEXT.textAlign = "start";
    CANVAS.CONTEXT.font = `${CONTROLS.FONT_SIZE}px Arial`;
    CANVAS.CONTEXT.fillText(text, 10, CANVAS.HEIGHT - 10);
  }

  /**
   * @file Menu.js
   * @method wordWrap()
   * @description convert a single line of text to paragraph form if the text exceeds the Canvas width
   * @function
   *    - split the text by the empty space character
   *    - measure the width of the line after concating the incoming word to the running currentLine
   *    - if addition of a word to currentLine causes the line to exceed the cutoff point, push the word to a new line
   * @param {String} text
   * @returns {string[]} an array consisting of the lines of words
   */
  wordWrap(text) {
    // subtract padding on both ends of the text lines so that the each line has a uniform length
    const lineCutOffPoint = CANVAS.WIDTH - INSTRUCTIONS.text.xPos * 2;
    const words = text.split(" ");
    const lines = [];
    let currentLine = words[0]; // start with the first word

    // start at 1 since we already added the first word
    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const lineWidth = CANVAS.CONTEXT.measureText(currentLine + " " + word).width;
      // if we can fit the word on the current line
      if (lineWidth < lineCutOffPoint) {
        currentLine += " " + word;
      } else {
        // if we cannot fit the word on the current line
        lines.push(currentLine); // finish the current line
        currentLine = word; // start a new line with the word that didn't fit
      }
    }

    lines.push(currentLine); // add the last line when finished iterating over the words
    return lines;
  }

  /**
   * @file Menu.js
   * @method setupGameOverMenuScreen()
   * @description changes the menu screen to display the Game Over Menu Screen
   * @function
   *    - set the value of the select menu option to the GAME_OVER option
   * @param none
   * @returns none
   */
  setupGameOverMenuScreen() {
    this.selection = MENU_OPTIONS.GAME_OVER;
    this.menuState = this.selection;
    this.playGame = false;
  }

  /**
   * @file Menu.js
   * @method drawOverlay()
   * @description draw a slightly transparent black overlay against the bright campus background
   * @function
   *    - draws a black overlay with alpha of approximately 0.8
   * @param none
   * @returns none
   */
  drawOverlay() {
    CANVAS.CONTEXT.globalAlpha = 0.8; // slightly transparent
    CANVAS.CONTEXT.fillStyle = "black";
    // draw the overlay component for the Menu
    CANVAS.CONTEXT.fillRect(
      this.overlay.padding,
      this.overlay.padding,
      this.overlay.width,
      this.overlay.height
    );
    CANVAS.CONTEXT.globalAlpha = 1; // reset to no transparency
  }

  /* ------------------- EVENT HANDLERS ------------------- */

  /**
   * @file Menu.js
   * @method keyDownHandler()
   * @description move the selection cursor up or down the menu options depending on Arrow Key pressed
   * @function
   *    - Down arrow key to move the cursor down the options
   *    - Up arrow key to move the cursor up the options
   *    - If the cursor would move past the top option, start back at the bottom option
   *    - If the cursor would move past the bottom option, start back at the top option
   * @param {event} event
   * @return none
   */
  keydownHandler(event) {
    // identify which submenu option the User has navigated to
    if (event.key === "ArrowUp" || event.key === "Up") {
      if (this.selection === MENU_OPTIONS.PLAY) {
        this.selection = MENU_OPTIONS.CONTROLS;
      } else if (this.selection === MENU_OPTIONS.HOW_TO_PLAY) {
        this.selection = MENU_OPTIONS.PLAY;
      } else if (this.selection === MENU_OPTIONS.CONTROLS) {
        this.selection = MENU_OPTIONS.HOW_TO_PLAY;
      }
    } else if (event.key === "ArrowDown" || event.key === "Down") {
      if (this.selection === MENU_OPTIONS.PLAY) {
        this.selection = MENU_OPTIONS.HOW_TO_PLAY;
      } else if (this.selection === MENU_OPTIONS.HOW_TO_PLAY) {
        this.selection = MENU_OPTIONS.CONTROLS;
      } else if (this.selection === MENU_OPTIONS.CONTROLS) {
        this.selection = MENU_OPTIONS.PLAY;
      }
    }

    // allow User to enter into a submenu or play the game
    if (event.key === "Enter") {
      if (this.selection === MENU_OPTIONS.GAME_OVER) {
        this.selection = MENU_OPTIONS.PLAY;
        this.menuState = "Main Menu";
        this.retry = true;
        this.playGame = false;
      } else {
        this.menuState = this.selection;
      }
    }

    // allow User to return to the Main Menu
    if (event.key === "Escape" || event.key === "Esc") {
      this.menuState = "Main Menu";
    }
  }

  /**
   * @file Menu.js
   * @method removeMenuEventListeners()
   * @description remove event listeners associated with the Menu when we change to the Game's Running state
   * @function
   *    - remove each event listener that was added to the document object
   * @param none
   * @returns none
   */
  removeMenuEventListeners() {
    document.removeEventListener("keydown", (event) => this.keydownHandler(event));
  }

  addMenuEventListeners() {
    document.addEventListener("keydown", (event) => this.keydownHandler(event));
  }

  /* ------------------- SETTERS ------------------- */

  /**
   * @file Menu.js
   * @method changeMenuScreen()
   * @description method to change the current Menu Screen option
   * @function
   *    - set the current menuState to the given menuOption
   * @param {String} menuOption
   * @returns none
   */
  changeMenuScreen(menuOption) {
    this.menuState = menuOption;
  }

  /* ------------------- GETTERS ------------------- */

  /**
   * @file Menu.ja
   * @method hasGameStarted()
   * @description determine if User has selected to start the Game
   * @function
   *    - will be called continuously in the script startGame method
   *    - return boolean value to determine Game State
   * @param none
   * @returns {boolean} playGame - true if User selected 'Play Game' Menu option, false otherwise
   */
  hasGameStarted() {
    return this.playGame;
  }

  toPlayAgain() {
    return this.retry;
  }
}

export default Menu;
