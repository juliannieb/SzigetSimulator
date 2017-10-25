/**
 * @file
 * This file provides the classes necessary to control the cameras of
 * the project.
 */


function createGodViewCamera(){
    orthoCam = new THREE.OrthographicCamera( width / - 1, width / 1, height / 1, height / - 1, 1, 10000 );
    orthoCam.position.z = 1000;
    return orthoCam;
}

function createCharCamera(reference){
    camera  = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 10;
    camera.up = new THREE.Vector3(0, 0, 1);
    return camera;
}

function createDJCamera(reference, stage){
    camera  = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 30;
    camera.position.x = 350;
    // camera.position = stage.position
    camera.up = new THREE.Vector3(0, 0, 1);
    camera.lookAt(reference.position)
    // camera.position(stage.stageMesh.position)
    return camera;
}


class ControllableCamera{
    constructor(camera){
        this.camera = camera;
        this.controls = new THREE.PointerLockControls(this.camera);
    }
}



