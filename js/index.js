/**
 * @file
 * Javascript file to control the index page.
 */

// @TODO: remove these variables as they are just for testing the volume control
var currentX, currentY;
var width = window.innerWidth;
var height = window.innerHeight;
var cube;

// Variables for the scene.
var cameras = [];
var scene, camera, renderer, light;
var planeGround;
var activeCamera;

var musicController;

let GROUND_WIDTH = 2000;
let GROUND_HEIGHT = 1200;

// Movement
var controls;
var controlsEnabled = false;

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;

var prevTime = performance.now();
var velocity = new THREE.Vector3();

var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );
// Request pointer lock
var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if ( havePointerLock ) {

    var element = document.body;

    var pointerlockchange = function ( event ) {

        if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

            controlsEnabled = true;
            controls.enabled = true;

            blocker.style.display = 'none';

        } else {

            controls.enabled = false;

            blocker.style.display = '-webkit-box';
            blocker.style.display = '-moz-box';
            blocker.style.display = 'box';

            instructions.style.display = '';
        }
    };

    var pointerlockerror = function ( event ) {

        instructions.style.display = '';

    };

    // Hook pointer lock state change events
    document.addEventListener( 'pointerlockchange', pointerlockchange, false );
    document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
    document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

    document.addEventListener( 'pointerlockerror', pointerlockerror, false );
    document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
    document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

    instructions.addEventListener( 'click', function ( event ) {

        instructions.style.display = 'none';

        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
        element.requestPointerLock();

    }, false );

} else {

    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

}

$( document ).ready(function(){
    init();
    addGround();  
    
    let stages = createStages();
    addReference()
    createCameras(stages[0]);
    musicController = new MusicController(stages);
    musicController.createAudios();
    currentX = 0;
    currentY = 0;
    musicController.calculateVolume(currentX, currentY);
    musicController.play();
    addOnKeyPressedListener();
    addOnKeyLiftedListener();
    addCamaraSelectListener();
    animate();
})

/**
 * Function to add scene, camera and light to canvas.
 */
function init() {
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    light = new THREE.AmbientLight(0xffffff, 2);
    light.position.set(0, 1, 0).normalize();
    scene.add(light);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;

    document.body.appendChild(renderer.domElement);
}

function animate() {
    requestAnimationFrame(animate);

    if ( controlsEnabled ) {
        var time = performance.now();
        var delta = ( time - prevTime ) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.y -= velocity.y * 10.0 * delta;

        velocity.z -= 9.8 * 100.0 * delta; // 100.0 = mass

        if ( moveForward ) velocity.y += 400.0 * delta;
        if ( moveBackward ) velocity.y -= 400.0 * delta;

        if ( moveLeft ) velocity.x -= 400.0 * delta;
        if ( moveRight ) velocity.x += 400.0 * delta;

        controls.getObject().translateX( velocity.x * delta );
        controls.getObject().translateZ( velocity.z * delta );
        controls.getObject().translateY( velocity.y * delta );

        if ( controls.getObject().position.z < 10 ) {

            velocity.z = 0;
            controls.getObject().position.z = 10;

            canJump = true;

        }

        prevTime = time;

    }

    musicController.calculateVolume(controls.getObject().position.x, controls.getObject().position.y);
    renderer.render(scene, activeCamera);
}


/** 
 * Add reference
 */

function addReference() {
    // Create a red block on the center
    var geometry = new THREE.BoxGeometry( 100, 100, 100 );
    var material = new THREE.MeshBasicMaterial( { color: 0x0000ff } );
    cube = new THREE.Mesh( geometry, material );
    scene.add( cube );
}

/**
 * Function to add ground in the scene.
 */
function addGround() {
    // Create texture for ground.
    var planeGeometry = new THREE.PlaneBufferGeometry( GROUND_WIDTH, GROUND_HEIGHT );
    var loader = new THREE.TextureLoader();
    loader.setCrossOrigin('Anonymous');
    var planeTexture = loader.load( "https://files.gamebanana.com/img/ss/textures/573db60672a5c.jpg" );
    var planeMaterial = new THREE.MeshStandardMaterial({ 
        map:planeTexture, 
        side:THREE.DoubleSide 
    });
    // Create mesh for ground.
    planeGround = new THREE.Mesh( planeGeometry, planeMaterial );
    planeGround.position.x = 0;
    planeGround.position.y = -30;    
    planeGround.receiveShadow = true;
    scene.add(planeGround);
}

/**
 * Function that creates the stages.
 * RETURNS:
 *  - Array containing Stage objects.
 */
function createStages() {
    var stages = [];
    // The different relative positions scales on four corners.
    var coordinatesScales = [[-1, 1, 1, -1], [1, -1, 1, -1], [1, -1, -1, 1], [-1, 1, -1, 1]];
    stages.push(new Stage(planeGround, coordinatesScales[0], "resources/TheXX_IDareYou.mp3"));    
    stages.push(new Stage(planeGround, coordinatesScales[1], "resources/TheKillers_ADustlandFairytale.mp3"));
    stages.push(new Stage(planeGround, coordinatesScales[2], "resources/30SecondsToMars_FromYesterday.mp3"));
    stages.push(new Stage(planeGround, coordinatesScales[3], "resources/TheChainsmokers_Closer.mp3"));
    // Add stages to the scene.
    stages.forEach(function(stage) {
        scene.add( stage.stageMesh );
    });

    return stages;
}

/** 
 * Funciton that creates the cameras
 * Returns:
 * - Array containing the Camera objects.
 */
function createCameras(stage){
    cameras.push(createGodViewCamera());
    mcamera = createCharCamera();
    mcamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
    controls = new THREE.PointerLockControls( mcamera );
    cameras.push(mcamera);
    scene.add( controls.getObject());
    cameras.push(createDJCamera(cube));
    activeCamera = cameras[1];
}

/**
 * Add a listener for the keyboard to change current position.
 */
function addOnKeyPressedListener() {
    $(document).keydown(function(event){
        event.preventDefault();
        if (event.keyCode == LEFT_KEY_CODE) {
            currentX -= 1;
            moveLeft = true;
        }
        else if (event.keyCode == UP_KEY_CODE) {
            currentY += 1;
            moveForward = true;
        }
        else if (event.keyCode == RIGHT_KEY_CODE) {
            moveRight = true;
        }
        else if (event.keyCode == DOWN_KEY_CODE) {
            moveBackward = true;
            currentY -= 1;
        } else if (event.keyCode == SPACE){
            if ( canJump === true ) velocity.z += 230;
            canJump = false;
        }
        console.log(currentX + ", " + currentY);
        // musicController.calculateVolume(controls.getObject().position.x, controls.getObject().position.y);
    });
}

function addOnKeyLiftedListener() {
    $(document).keyup(function(event){
        event.preventDefault();
        if (event.keyCode == LEFT_KEY_CODE) {
            moveLeft = false;
        }
        else if (event.keyCode == UP_KEY_CODE) {
            moveForward = false;
        }
        else if (event.keyCode == RIGHT_KEY_CODE) {
            moveRight = false;
        }
        else if (event.keyCode == DOWN_KEY_CODE) {
            moveBackward = false;
        }
        console.log(currentX + ", " + currentY);
        // musicController.calculateVolume(currentX, currentY);
    });
}

/**
 * Add a listener for the keyboard to change current camera.
 */
function addCamaraSelectListener() {
    $(document).keydown(function(event){
        event.preventDefault();
        if(event.keyCode >= MIN_CAMERA && event.key <= MAX_CAMERA){
            console.log(event.keyCode - MIN_CAMERA);
            activeCamera = cameras[event.keyCode - MIN_CAMERA];
        }
    });
}