
import * as THREE from "./build/three.module.js";
// Import pointer lock controls
import {
  PointerLockControls
} from "./src/PointerLockControls.js";

// Import add-ons for GLTF models and orbit controls
import { OrbitControls } from "./src/OrbitControls.js";
import { GLTFLoader } from "./src/GLTFLoader.js";



// Establish variables
let camera, scene, renderer, controls, material, mesh, mesh2, mesh3, mesh4, mesh5;

const objects = [];
let raycaster;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let canJump = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();

// Initialization and animation function calls
init();
animate();

// Initialize the scene
function init() {
  
  // Establish the camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.y = 10;

  // Define basic scene parameters
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x78b3c6);
  scene.fog = new THREE.Fog( 0xaaccff, 0.0007 );

  // Define scene lighting
  const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
  light.position.set(0.5, 1, 0.75);
  scene.add(light);

  // Define controls
  controls = new PointerLockControls(camera, document.body);

  // Identify the html divs for the overlays
  const blocker = document.getElementById("blocker");
  const instructions = document.getElementById("instructions");

  // Listen for clicks and respond by removing overlays and starting mouse look controls
  // Listen
  instructions.addEventListener("click", function() {
    controls.lock();
  });
  // Remove overlays and begin controls on click
  controls.addEventListener("lock", function() {
    instructions.style.display = "none";
    blocker.style.display = "none";
  });
  // Restore overlays and stop controls on esc
  controls.addEventListener("unlock", function() {
    blocker.style.display = "block";
    instructions.style.display = "";
  });
  // Add controls to scene
  scene.add(controls.getObject());

  // Define key controls for WASD controls
  const onKeyDown = function(event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = true;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = true;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = true;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = true;
        break;

      case "Space":
        if (canJump === true) velocity.y += 350;
        canJump = false;
        break;
    }
  };

  const onKeyUp = function(event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        moveForward = false;
        break;

      case "ArrowLeft":
      case "KeyA":
        moveLeft = false;
        break;

      case "ArrowDown":
      case "KeyS":
        moveBackward = false;
        break;

      case "ArrowRight":
      case "KeyD":
        moveRight = false;
        break;
    }
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  // Add raycasting for mouse controls
  raycaster = new THREE.Raycaster(
    new THREE.Vector3(),
    new THREE.Vector3(0, -1, 0),
    0,
    10
  );

  // Generate the ground
  let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
  floorGeometry.rotateX(-Math.PI / 1);

  // Vertex displacement pattern for ground
  let position = floorGeometry.attributes.position;

  for (let i = 0, l = position.count; i < l; i++) {
    vertex.fromBufferAttribute(position, i);

    vertex.x += Math.random() * 20 - 10;
    vertex.y += Math.random() * 2;
    vertex.z += Math.random() * 20 - 10;

    position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

  position = floorGeometry.attributes.position;
  const colorsFloor = [];

  for (let i = 0, l = position.count; i < l; i++) {
    color.setHSL(Math.random() * 1.1 + 1.5, 0.75, Math.random() * 0.25 + 0.75);
    colorsFloor.push(color.r, color.g, color.b);
  }

  floorGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colorsFloor, 3)
  );

  const floorMaterial = new THREE.MeshBasicMaterial({
    vertexColors: true
  });

  const floor = new THREE.Mesh(floorGeometry, floorMaterial);

  // Insert completed floor into the scene
  scene.add(floor);


  // Load image as texture
  const texture = new THREE.TextureLoader().load( "https://cdn.glitch.me/3e335929-113d-4f96-b239-a2b6d3724198%2FIMG_0711.JPG?v=1636958071217" );
  // Immediately use the texture for material creation
  const material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide } );
  // Create plane geometry
  const geometry = new THREE.CircleGeometry( 32, 16 );
  // Apply image texture to plane geometry
  const Circle = new THREE.Mesh( geometry, material );
  // Position plane geometry
  Circle.position.set(0 , 15 , -15);
  // Place plane geometry
  scene.add( Circle );

  // Load image as texture
  const texture2 = new THREE.TextureLoader().load("https://cdn.glitch.me/3e335929-113d-4f96-b239-a2b6d3724198%2FIMG_0048.JPG?v=1636958293308");
  // immediately use the texture for material creation
  const material2 = new THREE.MeshBasicMaterial( { map: texture2, side: THREE.DoubleSide } );
  // Create plane geometry
  const geometry2 = new THREE.SphereGeometry( 200, 100 );
  // Apply image texture to plane geometry
  const Sphere2 = new THREE.Mesh( geometry2, material2 );
  // Position plane geometry
  Sphere2.position.set(0 , 100 , -200);
  // Place plane geometry
  scene.add( Sphere2 );
  
  
				const TorusGeometry = new THREE.TorusGeometry( 10, 3, 16, 100 ).toNonIndexed();

				position = TorusGeometry.attributes.position;
				const colorsBox = [];

				for ( let i = 0, l = position.count; i < l; i ++ ) {

					color.setHSL( Math.random() * 1.3 + 0.5, 0.75, Math.random() * 2.25 + 0.75 );
					colorsBox.push( color.r, color.g, color.b );

				}

				TorusGeometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colorsBox, 3 ) );

				for ( let i = 0; i < 500; i ++ ) {

					const TorusMaterial = new THREE.MeshPhongMaterial( { specular: 0xd8bc75, flatShading: true, vertexColors: true } );
					TorusMaterial.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

					const Torus= new THREE.Mesh( TorusGeometry, TorusMaterial );
					Torus.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
					Torus.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
					Torus.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;

					scene.add( Torus );
					objects.push( Torus );

				}
 
  
  // Material to be added to model
var newMaterial = new THREE.MeshStandardMaterial({ color: 0xa0d875 });

// Variable for GLTF data
var mesh;

// Load GLTF model, add material, and add it to the scene
const loader = new GLTFLoader().load(
  "https://cdn.glitch.me/3e335929-113d-4f96-b239-a2b6d3724198%2Fworldglass.glb?v=1636938850379",
  function(gltf) {
    // Scan loaded model for mesh and apply defined material if mesh is present
    gltf.scene.traverse(function(child) {
      if (child.isMesh) {
        child.material = newMaterial;
      }
    });
    // set position and scale
    mesh = gltf.scene;
    mesh.position.set(5, 5, 20);
    mesh.scale.set(20, 20, 20);
    // Add model to scene
    scene.add(mesh);
  },
  undefined,
  function(error) {
    console.error(error);
  }
);
  

  // Material to be added to static model
  var newMaterial2 = new THREE.MeshStandardMaterial({
    color: 0x9dc7ff
  });

  // Load static model, add material, and add it to the scene
  const loader2 = new GLTFLoader().load(
    "https://cdn.glitch.me/3e335929-113d-4f96-b239-a2b6d3724198%2Fcrystals.glb?v=1637019867502",
    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          child.material = newMaterial2;
        }
      });
      // set position and scale
      mesh2 = gltf.scene;
      mesh2.position.set(-4, 0, 100);
      mesh2.rotation.set(0, 0, 0);
      mesh2.scale.set(1, 1, 1);
      // Add model to scene
      scene.add(mesh2);
      
      //brightness for entire scene/models
     const light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
scene.add( light );
      
 

    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
  
  
    // Material to be added to static model
  var newMaterial3 = new THREE.MeshStandardMaterial({
    color: 0xfff367
  });

  // Load static model, add material, and add it to the scene
  const loader3 = new GLTFLoader().load(
    "https://cdn.glitch.me/3e335929-113d-4f96-b239-a2b6d3724198%2Flollipop.glb?v=1637019837011",
    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          child.material = newMaterial3;
        }
      });
      // set position and scale
      mesh3 = gltf.scene;
      mesh3.position.set(-150, 0, 0);
      mesh3.rotation.set(0, 0, 0);
      mesh3.scale.set(5, 10, 1);
      // Add model to scene
      scene.add(mesh3);

    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
  
    // Material to be added to static model
  var newMaterial4 = new THREE.MeshStandardMaterial({
    color: 0x837fdd
  });

  // Load static model, add material, and add it to the scene
  const loader4 = new GLTFLoader().load(
    "https://cdn.glitch.me/3e335929-113d-4f96-b239-a2b6d3724198%2Flollipop2.glb?v=1637049884971",
    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          child.material = newMaterial4;
        }
      });
      // set position and scale
      mesh4 = gltf.scene;
      mesh4.position.set(100, 10, 5);
      mesh4.rotation.set(0, 0, 0);
      mesh4.scale.set(1, 1, 1);
      // Add model to scene
      scene.add(mesh4);

    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
  
  
      // Material to be added to static model
  var newMaterial5 = new THREE.MeshStandardMaterial({
    color: 0x2ae0a9
  });

  // Load static model, add material, and add it to the scene
  const loader5 = new GLTFLoader().load(
    "https://cdn.glitch.me/3e335929-113d-4f96-b239-a2b6d3724198%2Frock.glb?v=1637050541981",
    function(gltf) {
      // Scan loaded model for mesh and apply defined material if mesh is present
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          child.material = newMaterial5;
        }
      });
      // set position and scale
      mesh5 = gltf.scene;
      mesh5.position.set(-50, 50, 5);
      mesh5.rotation.set(0, 0, 0);
      mesh5.scale.set(1, 1, 1);
      // Add model to scene
      scene.add(mesh5);

    },
    undefined,
    function(error) {
      console.error(error);
    }
  );
  

  // Define Rendered and html document placement
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Listen for window resizing
  window.addEventListener("resize", onWindowResize);
}

// Window resizing function
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation function
function animate() {
  requestAnimationFrame(animate);

  const time = performance.now();

  // Check for controls being activated (locked) and animate scene according to controls
  if (controls.isLocked === true) {
    raycaster.ray.origin.copy(controls.getObject().position);
    raycaster.ray.origin.y -= 10;

    const intersections = raycaster.intersectObjects(objects, false);

    const onObject = intersections.length > 0;

    const delta = (time - prevTime) / 1000;

    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize(); // this ensures consistent movements in all directions

    if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

    if (onObject === true) {
      velocity.y = Math.max(0, velocity.y);
      canJump = true;
    }

    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);

    controls.getObject().position.y += velocity.y * delta; // new behavior

    if (controls.getObject().position.y < 10) {
      velocity.y = 0;
      controls.getObject().position.y = 10;

      canJump = true;
    }
  }

  prevTime = time;

  renderer.render(scene, camera);
}