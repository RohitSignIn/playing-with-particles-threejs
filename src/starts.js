import * as THREE from "three";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const gui = new GUI();

const canvas = document.getElementById("webgl");

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, size.width / size.height);
camera.position.z = 3;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.render(scene, camera);
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

// LIGHTNING - START

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

// LIGHTNING - END

const count = 800;
const positions = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 50;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);

const particlesMaterial = new THREE.PointsMaterial();
particlesMaterial.size = 0.2;
particlesMaterial.sizeAttenuation = true;
particlesMaterial.color = new THREE.Color(0x0000af);

const particles = new THREE.Points(particlesGeometry, particlesMaterial);

scene.add(particles);

// const box = new THREE.Points(
//   new THREE.BufferGeometryLoader(positions, 3),
//   new THREE.PointsMaterial({
//     size: 0.02,
//     sizeAttenuation: true,
//   })
// );
// scene.add(box);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.update();

const tick = () => {
  controls.update();

  renderer.render(scene, camera);

  requestAnimationFrame(tick);
};

tick();
