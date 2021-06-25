import * as THREE from "three";
import { CameraConfig } from "../config";

export default class Camera {
  constructor(renderer) {
    this._renderer = renderer;
    this.threeCamera = this._getCamera();
    this._updateSize(renderer);

    window.addEventListener("resize", () => this._updateSize, false);
  }

  _getCamera() {
    const { posX, posY, posZ, width, height, ratio } = CameraConfig;
    const cameraWidth = width;
    const cameraHeight = height;

    const camera = new THREE.OrthographicCamera(
      cameraWidth / -2,
      cameraWidth / 2,
      cameraHeight / 2,
      cameraHeight / -2,
      50,
      700
    );
    camera.position.set(posX, posY, posZ);

    camera.cameraWidth = cameraWidth;
    camera.cameraHeight = cameraHeight;
    camera.ratio = ratio;

    return camera;
  }

  _updateSize() {
    const { width, height } = this._renderer.domElement;
    this.threeCamera.aspect = width / height;
    this.threeCamera.updateProjectionMatrix();
  }
}
