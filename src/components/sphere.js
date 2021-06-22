import * as THREE from "three";

export default class Sphere {
  constructor() {
    this._step = 0;
    this._bouncingSpeed = 0.05;
    this.sphere = this._initSphere();
  }

  animateSphere() {
    this._step += this._bouncingSpeed;
    this.sphere.position.x = 20 + 10 * Math.cos(this._step);
    this.sphere.position.y = 4 + 10 * Math.abs(Math.sin(this._step));
  }

  _initSphere() {
    const sphereGeometry = new THREE.SphereGeometry(4, 20, 20);
    const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

    sphere.castShadow = true;
    sphere.position.set(20, 4, 2);

    return sphere;
  }
}
