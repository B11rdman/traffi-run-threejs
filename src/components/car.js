import * as THREE from "three";
import { pickRandom, VehicleColors } from "../config";

export default class Car extends THREE.Group {
  constructor() {
    super();

    this._build();
  }

  _build() {
    this._buildWheels();
    this._buildBody();
    this._buildCabin();
  }

  _buildWheels() {
    const geom = new THREE.BoxBufferGeometry(12, 33, 12);
    const material = new THREE.MeshLambertMaterial({ color: 0x333333 });

    this.add((this._backWheel = this._getWheel(geom, material, "back")));
    this.add((this._frontWheel = this._getWheel(geom, material, "front")));
  }

  _buildBody() {
    const geom = new THREE.BoxBufferGeometry(60, 30, 15);
    const color = pickRandom(VehicleColors);
    const material = new THREE.MeshLambertMaterial({ color });

    this._body = new THREE.Mesh(geom, material);
    this._body.position.set(0, 0, 12);

    this._body.castShadow = true;
    this._body.receiveShadow = false;

    this.add(this._body);
  }

  _buildCabin() {
    const frontTexture = this._getCarFrontTexture();
    frontTexture.center = new THREE.Vector2(0.5, 0.5);
    frontTexture.rotation = Math.PI / 2;

    const backTexture = this._getCarFrontTexture();
    backTexture.center = new THREE.Vector2(0.5, 0.5);
    backTexture.rotation = -Math.PI / 2;

    const rightTexture = this._getCarSideTexture();
    const leftTexture = this._getCarSideTexture();
    leftTexture.flipY = false;

    const geom = new THREE.BoxBufferGeometry(33, 24, 12);
    const material = new THREE.MeshLambertMaterial({ color: 0xffffff });

    this._cabin = new THREE.Mesh(geom, [
      new THREE.MeshLambertMaterial({ map: frontTexture }),
      new THREE.MeshLambertMaterial({ map: backTexture }),
      new THREE.MeshLambertMaterial({ map: leftTexture }),
      new THREE.MeshLambertMaterial({ map: rightTexture }),
      material,
      material,
    ]);
    this._cabin.position.set(-6, 0, 25.5);

    this._cabin.castShadow = false;
    this._cabin.receiveShadow = false;

    this.add(this._cabin);
  }

  _getCarFrontTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 64, 32);

    context.fillStyle = "#666666";
    context.fillRect(8, 8, 48, 32);

    return new THREE.CanvasTexture(canvas);
  }

  _getCarSideTexture() {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 128, 32);

    context.fillStyle = "#666666";
    context.fillRect(10, 8, 38, 24);
    context.fillRect(58, 8, 60, 24);

    return new THREE.CanvasTexture(canvas);
  }

  _getWheel(geom, material, place) {
    const x = place === "back" ? -18 : 18;
    const wheel = new THREE.Mesh(geom, material);
    wheel.position.set(x, 0, 6);
    wheel.castShadow = false;
    wheel.receiveShadow = false;

    return wheel;
  }
}
