import * as THREE from "three";

export default class Renderer {
  constructor(scene, container) {
    this._scene = scene;
    this._container = container;
    this.threeRenderer = this._initRenderer({ antialias: true });
    this._container.appendChild(this.threeRenderer.domElement);

    this.updateSize();

    document.addEventListener("DOMContentLoaded", () => this.updateSize(), false);
    window.addEventListener("resize", () => this.updateSize(), false);
  }

  render(scene, camera) {
    this.threeRenderer.render(scene, camera);
  }

  _initRenderer() {
    const threeRenderer = new THREE.WebGLRenderer();

    threeRenderer.setSize(this._container.offsetWidth, this._container.offsetHeight);
    threeRenderer.shadowMap.enabled = true;

    return threeRenderer;
  }

  updateSize() {
    this.threeRenderer.setSize(this._container.offsetWidth, this._container.offsetHeight);
  }
}
