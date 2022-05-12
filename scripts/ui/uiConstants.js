// retrieve the canvas from the HTML and set the dimensions
const gameCanvas = document.getElementById("game-canvas");
gameCanvas.width = 640; // set the canvas width to 640px (according to specs)
gameCanvas.height = 480; // set the canvas height to 480px (according to specs)

// canvas constants
export const CANVAS = {
  CONTEXT: gameCanvas.getContext("2d"),
  WIDTH: gameCanvas.width,
  HEIGHT: gameCanvas.height,
};

// describes the layout of the canvas areas
export const PADDING = {
  SIDE: 60, // enemy movement bounds
  TOP: 40, // space for UI elements (lives, score)
  BOTTOM: 80, // space for Player sprite area
};

// coordinates to display the scoreboard when the game is running
export const SCORE_DISPLAY = {
  X_POS: 460,
  Y_POS: 20,
};


