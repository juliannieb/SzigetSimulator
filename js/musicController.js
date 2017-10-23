/**
 * @file
 * This file provides a class to manage the music of the project.
 */

 /**
 * Class representing a controller for the music of the project.
 */
class MusicController {
    
    constructor(stages) {
        this.stages = stages;
    }

    createAudios() {
        for (var i = 0; i < this.stages.length; i++) {
            this.stages[i].createAudio();
        }
    }

    play() {
        for (var i = 0; i < this.stages.length; i++) {
            this.stages[i].audio.play();
        }
    }

    calculateVolume(x, y) {
        for (var i = 0; i < this.stages.length; i++) {
            this.stages[i].audio.volume = this.stages[i].calculateMusicVolume(x, y);
        }
    }

}