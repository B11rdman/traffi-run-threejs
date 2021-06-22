import * as THREE from "three";
import { CameraConfig } from "../config";

export default class Camera {
  constructor(renderer) {
    this.threeCamera = this._getCamera(renderer);
    this._updateSize(renderer);

    window.addEventListener("resize", this._updateSize.bind(this, renderer), false);
  }

  _getCamera(renderer) {
    const { width, height } = renderer.domElement;
    const { fov, near, far, posX, posY, posZ } = CameraConfig;

    const camera = new THREE.PerspectiveCamera(fov, width / height, near, far);
    camera.position.set(posX, posY, posZ);
    return camera;
  }

  _updateSize(renderer) {
    const { width, height } = renderer.domElement;
    this.threeCamera.aspect = width / height;
    this.threeCamera.updateProjectionMatrix();
  }
}
