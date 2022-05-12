import { CANVAS, PADDING } from "../ui/uiConstants.js";

// 5 rows and 11 columns will create 55 enemies according to specs doc
export const GRID_SIZE = {
  ROWS: 5,
  COLUMNS: 11,
};

// measurements based on specified size 640px by 480px canvas
const gridArea = {
  HEIGHT: CANVAS.HEIGHT - (PADDING.TOP + PADDING.BOTTOM) - 160, // 200px
  WIDTH: CANVAS.WIDTH - PADDING.SIDE * 2, // 520px
};

// spacing between enemy objects on the canvas
// enemy sprites should be adjusted to fit inside a 40px by 40px area (based on 640 x 480px canvas)
export const GRID_SPACING = {
  VERTICAL: Math.floor(gridArea.HEIGHT / GRID_SIZE.ROWS), // 40px
  HORIZONTAL: Math.floor(gridArea.WIDTH / GRID_SIZE.COLUMNS - 7), // 40px
};
