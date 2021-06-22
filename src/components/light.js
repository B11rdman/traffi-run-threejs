import * as THREE from "three";

export default class Light {
  constructor() {
    this.spotlight = this._initSpotlight();
  }

  addLights(scene) {
    scene.add(this.spotlight);
  }

  _initSpotlight() {
    const spotLight = new THREE.SpotLight(0xffffff);

    spotLight.position.set(-40, 60, -10);
    spotLight.castShadow = true;

    return spotLight;
  }
}
