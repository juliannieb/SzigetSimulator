/**
 * @file
 * Javascript file to control the index page.
 */

// @TODO: remove these variables as they are just for testing the volume control
var currentX, currentY;

// Variables for the scene.
var scene, camera, renderer, light;
var planeGround;
var stages = [];

var musicController;

$( document ).ready(function(){
    init();    

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

    camera  = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    renderer.shadowMapSoft = true;

    document.body.appendChild(renderer.domElement);

    addGround();
    //addStages();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

/**
 * Function to add ground in the scene.
 */
function addGround() {
    // Create texture for ground.
    var planeGeometry = new THREE.PlaneBufferGeometry( 2000, 1200 );
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