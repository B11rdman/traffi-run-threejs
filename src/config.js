import * as THREE from "three";

const container = document.getElementById("container");
const cWidth = 960;
const ratio = container.offsetWidth / container.offsetHeight;

export const CameraConfig = {
  posX: 0,
  posY: -210,
  posZ: 300,
  ratio,
  width: cWidth,
  height: cWidth / ratio,
};

export const VehicleColors = [0xa52523, 0xef2d56, 0x0ad3ff, 0xff9f1c /*0xa52523, 0xbdb638, 0x78b14b*/];

export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function HitZone() {
  const hitZone = new THREE.Mesh(
    new THREE.CylinderGeometry(20, 20, 60, 30),
    new THREE.MeshLambertMaterial({ color: 0xff0000 })
  );
  hitZone.position.z = 25;
  hitZone.rotation.x = Math.PI / 2;

  scene.add(hitZone);
  return hitZone;
}
