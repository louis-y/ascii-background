import * as THREE from 'https://esm.sh/three@0.160.1';
import { AsciiEffect } from 'https://esm.sh/three@0.160.1/examples/jsm/effects/AsciiEffect.js';
import { GLTFLoader } from 'https://esm.sh/three@0.160.1/examples/jsm/loaders/GLTFLoader.js';

const settings = {
  modelPath: 'models/flowers.glb',
  asciiCharacters: ' .:-+1*=%#',
  asciiColor: '#8b8b8b',
  asciiFontSize: 8,
  modelScale: 16,
  modelPosition: {
    x: 0,
    y: -5,
    z: 3,
  },
  rotationSpeed: -0.002,
};

let scene;
let camera;
let renderer;
let effect;
let model;

init();
animate();

function init() {
  createScene();
  createCamera();
  createLighting();
  createRenderer();
  createAsciiEffect();
  loadModel();

  window.addEventListener('resize', handleResize);
}

function createScene() {
  scene = new THREE.Scene();
}

function createCamera() {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );

  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);
}

function createLighting() {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
  directionalLight.position.set(2, 4, 2);
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 15);
  scene.add(ambientLight);
}

function createRenderer() {
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
  });

  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function createAsciiEffect() {
  effect = new AsciiEffect(renderer, settings.asciiCharacters);
  effect.setSize(window.innerWidth, window.innerHeight);

    Object.assign(effect.domElement.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    margin: '0',
    padding: '0',
    color: settings.asciiColor,
    backgroundColor: 'transparent',
    whiteSpace: 'pre',
    fontFamily: 'monospace',
    fontSize: `${settings.asciiFontSize}px`,
    lineHeight: `${settings.asciiFontSize}px`,
  });

  document.querySelector('#ascii-background').appendChild(effect.domElement);
}

function loadModel() {
  const loader = new GLTFLoader();

  loader.load(
    settings.modelPath,
    (gltf) => {
      model = gltf.scene;

      centerModel(model);
      scaleModel(model);
      positionModel(model);

      scene.add(model);
    },
    undefined,
    (error) => {
      console.error('Failed to load GLB:', error);
    }
  );
}

function centerModel(object) {
  const box = new THREE.Box3().setFromObject(object);
  const center = new THREE.Vector3();

  box.getCenter(center);
  object.position.sub(center);
}

function scaleModel(object) {
  const box = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();

  box.getSize(size);

  const largestDimension = Math.max(size.x, size.y, size.z);
  const scale = settings.modelScale / largestDimension;

  object.scale.setScalar(scale);
}

function positionModel(object) {
  object.position.x += settings.modelPosition.x;
  object.position.y += settings.modelPosition.y;
  object.position.z += settings.modelPosition.z;
}

function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  effect.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  if (model) {
    model.rotation.y += settings.rotationSpeed;
  }

  effect.render(scene, camera);
}