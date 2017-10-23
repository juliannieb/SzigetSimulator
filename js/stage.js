/**
 * @file
 * This file provides a class to represent an stage in the map.
 */

 /**
 * Class representing a stage in the map.
 */
class Stage {

    constructor(posX, posY, maxAudioDistance, audioSource) {
        this.posX = posX;
        this.posY = posY;
        this.maxAudioDistance = maxAudioDistance;
        this.audioSource = audioSource;
    }

    createAudio() {
        this.audio = new Audio(this.audioSource);
    }

    distanceFrom(x, y) {
        let distanceX = Math.abs(this.posX - x);
        let distanceY = Math.abs(this.posY - y);
        let distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
        return distance;
    }

    calculateMusicVolume(x, y) {
        if (this.maxAudioDistance == 0) {
            return 0;
        }
        let distance = this.distanceFrom(x, y);
        var musicVolume = 1 - (distance / this.maxAudioDistance);
        return musicVolume < 0 ? 0 : musicVolume;
    }

}