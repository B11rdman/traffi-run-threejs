import * as THREE from "three";

export default class Light {
  constructor() {
    this.ambientLight = this._initAmbientLight();
    this.dirLight = this._initDirLight();
  }

  addLights(scene) {
    scene.add(this.ambientLight);
    scene.add(this.dirLight);
  }

  _initAmbientLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);

    return ambientLight;
  }

  _initDirLight() {
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(100, -300, 300);

    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.left = -400;
    dirLight.shadow.camera.right = 350;
    dirLight.shadow.camera.top = 400;
    dirLight.shadow.camera.bottom = -300;
    dirLight.shadow.camera.near = 100;
    dirLight.shadow.camera.far = 800;

    return dirLight;
  }
}
