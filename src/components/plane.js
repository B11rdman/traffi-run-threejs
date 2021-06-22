import * as THREE from "three";

export default class Plane {
  constructor() {
    this.plane = this._initPlane();
  }

  _initPlane() {
    const planeGeometry = new THREE.PlaneBufferGeometry(60, 40, 1, 1);
    const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.set(15, 0, 0);
    plane.receiveShadow = true;

    return plane;
  }
}
