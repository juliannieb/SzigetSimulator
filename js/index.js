/**
 * @file
 * Javascript file to control the index page.
 */

// @TODO: remove these variables as they are just for testing the volume control
var currentX, currentY;

var musicController;

$( document ).ready(function(){
    let stage1 = new Stage(0, 10, 10, "resources/TheXX_IDareYou.mp3");
    let stage2 = new Stage(1, 5, 10, "resources/TheKillers_ADustland Fairytale.mp3");
    let stages = [stage1, stage2];
    musicController = new MusicController(stages);
    musicController.createAudios();
    currentX = 0;
    currentY = 0;
    musicController.calculateVolume(currentX, currentY);
    musicController.play();
    addOnKeyPressedListener();
})

/**
 * Add a listener for the keyboard to change current position.
 */
function addOnKeyPressedListener() {
    $(document).keydown(function(event){
        event.preventDefault();
        if (event.keyCode == LEFT_KEY_CODE) {
            currentX -= 1;
        }
        else if (event.keyCode == UP_KEY_CODE) {
            currentY += 1;
        }
        else if (event.keyCode == RIGHT_KEY_CODE) {
            currentX += 1;
        }
        else if (event.keyCode == DOWN_KEY_CODE) {
            currentY -= 1;
        }
        console.log(currentX + ", " + currentY);
        musicController.calculateVolume(currentX, currentY);
    });
}