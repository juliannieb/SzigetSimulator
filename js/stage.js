/**
 * @file
 * This file provides a class to represent an stage in the map.
 */

 /**
 * Class representing a stage in the map.
 */
class Stage {

    constructor(posX, posY, audioSource) {
        this.posX = posX;
        this.posY = posY;
        this.audioSource = audioSource;
    }

    distanceFrom(x, y) {
        let distanceX = Math.abs(this.posX - x);
        let distanceY = Math.abs(this.posY - y);
        let distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
        return distance;
    }

}