import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";
import * as dat from "dat.gui";

const gui = new dat.GUI();

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.set(0, 0, 10);
scene.add(camera);

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const color = {
  color: 0x00ff00,
};
const cubeMaterial = new THREE.MeshBasicMaterial(color);

const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

const params = {
  fn: () => {
    gsap.to(cube.position, {
      duration: 5,
      x: 5,
      ease: "power1.inOut",
      repeat: -1,
      delay: 2,
      yoyo: true,
      onComplete: () => console.log("done"),
      onStart: () => console.log("start"),
    });
  },
};

scene.add(cube);
gui
  .add(cube.position, "x")
  .max(10)
  .min(-10)
  .step(0.01)
  .name("position x")
  .onChange((value) => console.log("changed", value))
  .onFinishChange((value) => console.log("finished", value));
gui.addColor(color, "color").onChange((value) => {
  console.log(value);
  cubeMaterial.color.set(value);
});
gui.add(cube, "visible").name("visible");
gui.add(params, "fn").name("animate");
const folder = gui.addFolder("folder");
folder.add(cube.material, "wireframe").name("wireframe");

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

document.body.appendChild(renderer.domElement);

cube.scale.set(2, 2, 1);

// let animate = gsap.to(cube.position, {
//   duration: 5,
//   x: 5,
//   ease: "power1.inOut",
//   repeat: -1,
//   delay: 2,
//   yoyo: true,
//   onComplete: () => console.log("done"),
//   onStart: () => console.log("start"),
// });
// let animate1 = gsap.to(cube.rotation, {
//   duration: 5,
//   x: 2 * Math.PI,
//   ease: "power1.inOut",
// });

// window.addEventListener("dblclick", () => {
//   if (animate.isActive()) {
//     animate.pause();
//     animate1.pause();
//   } else {
//     animate.resume();
//     animate1.resume();
//   }
// });

window.addEventListener("dblclick", () => {
  if (document.fullscreenElement) {
    document.exitFullscreen().then(r => console.log(r));
  } else {
    renderer.domElement.requestFullscreen().then(r => console.log(r));
  }
});

function render() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

render();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
