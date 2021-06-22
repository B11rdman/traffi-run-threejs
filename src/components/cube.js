import * as THREE from "three";

export default class Cube {
  constructor() {
    this._rotationSpeed = 0.015;
    this.cube = this._initCube();
  }

  animateCube() {
    this.cube.rotation.x += this._rotationSpeed;
    this.cube.rotation.y += this._rotationSpeed;
    this.cube.rotation.z += this._rotationSpeed;
  }

  _initCube() {
    const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);
    const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

    cube.castShadow = true;
    cube.position.set(-4, 3, 0);

    return cube;
  }
}
