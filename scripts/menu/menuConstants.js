import { CANVAS } from "../ui/uiConstants.js";

// to align text at the center line of the canvas
const centerAlignXPosition = CANVAS.WIDTH / 2;

// Menu Control text
export const RETURN_TO_MENU_TEXT = "Press 'Esc' to return to Main Menu";
export const SELECT_OPTION_TEXT = "Press 'Enter' to select an Option";
export const PLAY_AGAIN_TEXT = "Press 'Enter' to Play Again";

export function createMenuOverlay() {
  const padding = 30;
  const overlayWidth = CANVAS.WIDTH - padding * 2;
  const overlayHeight = CANVAS.HEIGHT - padding * 2;

  return {
    padding: padding,
    width: overlayWidth,
    height: overlayHeight,
  };
}

// Represents the different submenu options on the main menu screen
export const MENU_OPTIONS = {
  FONT_SIZE: 25, // font size for submenu text
  VERTICAL_SPACING: 60,
  MAX_TEXT_WIDTH: 150, // max width (px) that the menu option text can occupy
  PLAY: 1,
  HOW_TO_PLAY: 2,
  CONTROLS: 3,
  GAME_OVER: 4,
};

export const MAIN_MENU = {
  title: {
    text: "College Invaders",
    xPos: centerAlignXPosition,
    yPos: CANVAS.HEIGHT / 4,
  },
  playGame: {
    text: "Play Game",
    xPos: centerAlignXPosition,
    yPos: CANVAS.HEIGHT / 2.2,
  },
  howToPlay: {
    text: "How To Play",
    xPos: centerAlignXPosition,
    yPos: CANVAS.HEIGHT / 2.2 + MENU_OPTIONS.VERTICAL_SPACING,
  },
  controls: {
    text: "Controls",
    xPos: centerAlignXPosition,
    yPos: CANVAS.HEIGHT / 2.2 + MENU_OPTIONS.VERTICAL_SPACING * 2,
  },
  gameOver: {
    text: "Play Again?",
    xPos: centerAlignXPosition,
    yPos: CANVAS.HEIGHT / 1.2,
  }
};

export const INSTRUCTIONS = {
  FONT_SIZE: 15,
  text: {
    words:
      "The objective is to live as long as possible while trying to ward off the wave of professors. You are a student who can combat the professors. How long will you last?",
    xPos: 50,
    yPos: 150,
  },
};

export const CONTROLS = {
  FONT_SIZE: 15,
};

export const GAME_OVER = {
  FONT_SIZE: 15,
};
