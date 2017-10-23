/**
 * @file
 * Javascript file to control the index page.
 */

$( document ).ready(function(){
    let stage1 = new Stage(-2, 1, "resources/TheXX_IDareYou.mp3");
    let stage2 = new Stage(1, 5, "resources/TheKillers_ADustland Fairytale.mp3");
    let stages = [stage1, stage2];
    let musicController = new MusicController(stages);
    musicController.createAudios();
    musicController.play();
})