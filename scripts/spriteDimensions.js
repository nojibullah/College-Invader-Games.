// utility function
// can be used to retrieve different spritesheet dimensions based on which sprite is being requested
export function getSpriteDimensions(spriteType) {
  switch (spriteType) {
    case "ezTeach":
      return {
        // dimensions for each frame (rectangle) in the images/ezteach.png spritesheet
        spriteWidth: 550,
        spriteHeight: 800,
        imageCount: 3,
      };

      //@todo Put the correct bullet for the player and adjust
    case "playerBullet":
      return {
        spriteWidth: 250,
        spriteHeight: 250,
        imageCount: 4,
      };
      

      //@todo Put the correct bullet for the enemy and adjust 
    case "enemyBullet":
      return {
        spriteWidth: 395,
        spriteHeight: 395,
        imageCount: 4,
      };

      
      
    default:
      return {
        spriteWidth: 40,
        spriteHeight: 40,
      };
  }
}
