/**
 * @file
 * This file provides a class to represent an stage in the map.
 */

 /**
 * Class representing a stage in the map.
 */
class Stage {

    constructor(groundPlane, coordsScales, audioSource) {
        // Create the texture.    
        var loader = new THREE.TextureLoader();
        loader.setCrossOrigin('Anonymous');
        var stageTexture = loader.load( "https://previews.123rf.com/images/ditara/ditara1009/ditara100900016/7788244-Rusty-metal-texture-for-the-background-Stock-Photo-iron-rusty-sheet.jpg" );
        var boxMaterial = new THREE.MeshStandardMaterial({ 
            map:stageTexture, 
            side:THREE.DoubleSide 
        });
        // Define stage measures based on groundPlane.
        var planeHeight = planeGround.geometry.parameters.height;
        var planeWidth = planeGround.geometry.parameters.width;
        this.height = planeHeight/2 - planeHeight/6;
        this.width = planeWidth/4;
        this.depth = 30;
        // Define the mesh of the stage.
        var geometry = new THREE.BoxBufferGeometry( this.width, this.height, this.depth );
        this.stageMesh = new THREE.Mesh(geometry, boxMaterial);
        this.stageMesh.position.x = planeGround.position.x + (planeWidth/2*coordsScales[0]) + (this.width/2*coordsScales[1]);
        this.stageMesh.position.y = planeGround.position.y + (planeHeight/2*coordsScales[2]) + (this.height/2*coordsScales[3]);
        this.stageMesh.position.z = this.depth/2;
        this.stageMesh.rotation.x = planeGround.rotation.x;
        this.stageMesh.castShadow = true;
        // Set variables for audio control.
        this.posX = this.stageMesh.position.x + this.width / 2;
        this.posY = this.stageMesh.position.y + this.height / 2;
        this.maxAudioDistance = this.distanceFrom(0, 0);
        this.audioSource = audioSource;
        this.djSetMesh = this.createDJSet();
        this.posterMesh = this.createArtistPoster(coordsScales[1]);
        console.log(this.posX + ", " + this.posY);
    }

    createAudio() {
        this.audio = new Audio(this.audioSource);
    }

    /**
     * Creates the DJ's set in the center of the stage
     * RETURNS:
     *  - mesh of set
     */
    createDJSet() {
        var setWidth = this.width / 5;
        var setHeight = this.height / 5;
        var setDepth = 30;
        var geometry = new THREE.BoxBufferGeometry(setWidth, setHeight, setDepth);
        var material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
        var djSetMesh = new THREE.Mesh(geometry, material);
        djSetMesh.position.x = this.stageMesh.position.x;
        djSetMesh.position.y = this.stageMesh.position.y;
        djSetMesh.position.z = this.depth + setDepth/2;
        return djSetMesh;
    }

    /**
     * Creates DJ's poster and position it behing the set
     * RETURNS:
     * - mesh of poster
     */
    createArtistPoster(posScale) {
        var posterWidth = this.width / 1.5;
        var posterHeight = this.depth * 4;
        var distanceToSet = 50;
        var geometry = new THREE.PlaneBufferGeometry(posterWidth, posterHeight);
        var material = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
        var posterMesh = new THREE.Mesh(geometry, material);
        posterMesh.position.x = this.djSetMesh.position.x - this.djSetMesh.geometry.parameters.width/2*posScale - distanceToSet*posScale;
        posterMesh.position.y = this.stageMesh.position.y;
        posterMesh.position.z = this.depth + posterHeight/2;
        posterMesh.rotateX(-Math.PI / 2);
        posterMesh.rotateY(-Math.PI / 2);
        console.log(posterMesh);
        return posterMesh;
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