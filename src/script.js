import * as THREE from "three";
// import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/Addons.js";

// const gui = new GUI();

const canvas = document.getElementById("webgl");

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const textureLoader = new THREE.TextureLoader();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, size.width / size.height);
camera.position.z = 22;
camera.position.y = -12;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.render(scene, camera);
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

// LIGHTNING - START

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

// LIGHTNING - END

// const box = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1),
//   new THREE.MeshStandardMaterial({ color: "#ffffff" })
// );

// scene.add(box);

const count = 5500;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 30;
  colors[i] = Math.random();
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const particlesMaterial = new THREE.PointsMaterial();
particlesMaterial.vertexColors = true;
const particles = new THREE.Points(particlesGeometry, particlesMaterial);
camera.lookAt(particles.position);
const particleTextures = textureLoader.load("textures/particles/2.png");

particlesMaterial.size = 0.8;
particlesMaterial.sizeAttenuation = true;
// particlesMaterial.color = new THREE.Color("#ff88cc");
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particleTextures;
// particlesMaterial.alphaTest = 0.001;
// particlesMaterial.depthTest = false;
particlesMaterial.depthWrite = false;
particlesMaterial.blending = THREE.AdditiveBlending;

scene.add(particles);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.update();

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const x = particlesGeometry.attributes.position.array[i3];
    const y = particlesGeometry.attributes.position.array[i3 + 2];
    const z = particlesGeometry.attributes.position.array[i3 + 3];
    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
      elapsedTime + x
    );
  }

  particlesGeometry.attributes.position.needsUpdate = true;

  controls.update();

  renderer.render(scene, camera);

  requestAnimationFrame(tick);
};

tick();
