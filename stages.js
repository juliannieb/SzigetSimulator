var scene, camera, renderer;
var light;
var planeGround;
var stages = [];


init();
animate();

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
    addStages();
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

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

function addStages() {
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
    var height = planeHeight/2 - planeHeight/6;
    var width = planeWidth/4;
    var geometry = new THREE.BoxBufferGeometry( width, height, 100 );

    // Add stages to the stages array with different relative positions on four corners.
    var coordinatesScales = [[-1, 1, 1, -1], [1, -1, 1, -1], [1, -1, -1, 1], [-1, 1, -1, 1]];
    coordinatesScales.forEach(function(coords) {
        var stageMesh = new THREE.Mesh(geometry, boxMaterial);
        stageMesh.position.x = planeGround.position.x + (planeWidth/2*coords[0]) + (width/2*coords[1]);
        stageMesh.position.y = planeGround.position.y + (planeHeight/2*coords[2]) + (height/2*coords[3]);
        stageMesh.position.z = planeGround.position.z;
        stageMesh.rotation.x = planeGround.rotation.x;
        stageMesh.castShadow = true;
        stages.push(stageMesh);
    });

    // Add stages to the scene.
    stages.forEach(function(stage) {
        scene.add( stage );
    });
}