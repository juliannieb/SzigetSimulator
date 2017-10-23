/**
 * @file
 * Javascript file to control the index page.
 */

$( document ).ready(function(){
    let stage1 = new Stage("resources/TheXX_IDareYou.mp3");
    let stage2 = new Stage("resources/TheKillers_ADustland Fairytale.mp3");
    let stages = [stage1, stage2];
    let musicController = new MusicController(stages);
    musicController.createAudios();
    musicController.play();
})