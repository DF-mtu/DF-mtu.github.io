import * as THREE from 'three';

import { OrbitControls }
from 'three/addons/controls/OrbitControls.js';

import { GLTFLoader }
from 'three/addons/loaders/GLTFLoader.js';



const scene = new THREE.Scene();

scene.background = new THREE.Color(0xf0f0f0);



const renderer = new THREE.WebGLRenderer({
    antialias:true
});

renderer.setSize(window.innerWidth, window.innerHeight);

document.getElementById("viewer").appendChild(renderer.domElement);



const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth/window.innerHeight,
    0.1,
    1000
);

// Initial camera position
camera.position.set(-2,2,-4);


const controls = new OrbitControls(camera, renderer.domElement);

controls.enableDamping = true;

controls.target.set(0, 2, 0);


// Ambient light
scene.add(new THREE.AmbientLight(0xffffff,2));



// Directional light
const light = new THREE.DirectionalLight(0xffffff,3);

light.position.set(5,10,7);

scene.add(light);



const loader = new GLTFLoader();

loader.load(
    "models/lab2.glb",

    function(gltf){

        scene.add(gltf.scene);

    },

    undefined,

    function(error){

        console.error(error);

    }

);



window.addEventListener("resize",()=>{

    camera.aspect=window.innerWidth/window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth,window.innerHeight);

});



function animate(){

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene,camera);

}

animate();