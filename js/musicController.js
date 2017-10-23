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
        this.audios = [];
    }

    createAudios() {
        for (var i = 0; i < this.stages.length; i++) {
            this.audios.push(newAudio(stages[i].audioSource));
        }
    }

    newAudio(audioSource) {
        return new Audio(audioSource);
    }

    play() {
        for (var i = 0; i < this.audios.length; i++) {
            this.audios[i].play();
        }
    }

}