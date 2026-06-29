import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const vrConfig = {
    fov: 90,
    singleEyeAspect: 1.0,
    eyeSeparation: 0.06,
    distortionK: 0.3 
};

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111); 

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("viewer").appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(vrConfig.fov, vrConfig.singleEyeAspect, 0.1, 1000);
camera.position.set(-1.6, 1.5, -4.5);

const leftCamera = new THREE.PerspectiveCamera();
const rightCamera = new THREE.PerspectiveCamera();


const renderTargetParams = {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
};
const leftTarget = new THREE.WebGLRenderTarget(512, 512, renderTargetParams);
const rightTarget = new THREE.WebGLRenderTarget(512, 512, renderTargetParams);

const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const postScene = new THREE.Scene();

const postMaterial = new THREE.ShaderMaterial({
    uniforms: {
        tLeft: { value: leftTarget.texture },
        tRight: { value: rightTarget.texture },
        distortionK: { value: vrConfig.distortionK }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0); 
        }
    `,
    fragmentShader: `
        uniform sampler2D tLeft;
        uniform sampler2D tRight;
        uniform float distortionK;
        varying vec2 vUv;

        void main() {
            bool isLeft = vUv.x < 0.5;
            
            vec2 eyeUv = vec2(isLeft ? (vUv.x * 2.0) : ((vUv.x - 0.5) * 2.0), vUv.y);
            
            vec2 centered = eyeUv * 2.0 - 1.0;
            float r2 = dot(centered, centered);
            
            vec2 distortedCentered = centered * (1.0 + distortionK * r2);
            
            vec2 distortedEyeUv = distortedCentered * 0.5 + 0.5;
            
            if (distortedEyeUv.x < 0.0 || distortedEyeUv.x > 1.0 || 
                distortedEyeUv.y < 0.0 || distortedEyeUv.y > 1.0) {
                gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); //ambcolor
            } else {
                if (isLeft) {
                    gl_FragColor = texture2D(tLeft, distortedEyeUv);
                } else {
                    gl_FragColor = texture2D(tRight, distortedEyeUv);
                }
            }
        }
    `
});

const postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMaterial);
postScene.add(postQuad);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1.2, 0);

scene.add(new THREE.AmbientLight(0xffffff, 2));
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(5, 10, 7);
scene.add(light);

const loader = new GLTFLoader();
loader.load("models/lab2.glb", (gltf) => {
    scene.add(gltf.scene);
}, undefined, (error) => {
    console.error(error);
});

let renderArea = { width: 0, height: 0, offsetX: 0, offsetY: 0 };

function updateRenderArea() {
    const windowW = window.innerWidth;
    const windowH = window.innerHeight;
    const windowAspect = windowW / windowH;
    
    const totalTargetAspect = vrConfig.singleEyeAspect * 2;

    if (windowAspect > totalTargetAspect) {
        renderArea.height = windowH;
        renderArea.width = renderArea.height * totalTargetAspect;
    } else {
        renderArea.width = windowW;
        renderArea.height = renderArea.width / totalTargetAspect;
    }

    renderArea.offsetX = (windowW - renderArea.width) / 2;
    renderArea.offsetY = (windowH - renderArea.height) / 2;

    camera.fov = vrConfig.fov;
    camera.aspect = vrConfig.singleEyeAspect; 
    camera.updateProjectionMatrix();
    const eyeWidth = renderArea.width / 2;
    leftTarget.setSize(eyeWidth, renderArea.height);
    rightTarget.setSize(eyeWidth, renderArea.height);
    
}

window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    updateRenderArea();
});
updateRenderArea();

function updateStereoCameras() {
    leftCamera.copy(camera);
    rightCamera.copy(camera);

    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    leftCamera.position.copy(camera.position).addScaledVector(right, -vrConfig.eyeSeparation / 2);
    rightCamera.position.copy(camera.position).addScaledVector(right, vrConfig.eyeSeparation / 2);
}

function render() {
    requestAnimationFrame(render);
    controls.update();
    updateStereoCameras();

    postMaterial.uniforms.distortionK.value = vrConfig.distortionK;

    const { width, height, offsetX, offsetY } = renderArea;

    renderer.setRenderTarget(leftTarget);
    renderer.clear();
    renderer.render(scene, leftCamera);

    renderer.setRenderTarget(rightTarget);
    renderer.clear();
    renderer.render(scene, rightCamera);

    renderer.setRenderTarget(null); 
    
    renderer.setViewport(offsetX, offsetY, width, height);
    renderer.setScissor(offsetX, offsetY, width, height);
    renderer.setScissorTest(true);
    
    renderer.render(postScene, postCamera);
    
    renderer.setScissorTest(false);
}

render();