import * as THREE from "three";
import { pickRandom, VehicleColors } from "../config";

const WheelConfig = {
  front: {
    x: 38,
    y: 0,
    z: 6,
  },
  middle: {
    x: 0,
    y: 0,
    z: 6,
  },
  back: {
    x: -30,
    y: 0,
    z: 6,
  },
};

export default class Truck extends THREE.Group {
  constructor() {
    super();

    this._build();
  }

  _build() {
    this._buildWheels();
    this._buildTrailer();
    this._buildConnector();
    this._buildCabin();
  }

  _buildWheels() {
    this.add((this._backWheel = this._getWheel("back")));
    this.add((this._middleWheel = this._getWheel("middle")));
    this.add((this._frontWheel = this._getWheel("front")));
  }

  _buildTrailer() {
    const video = document.getElementById("video");
    const texture = new THREE.VideoTexture(video);
    console.warn(texture);

    const geom = new THREE.BoxBufferGeometry(60, 30, 30);
    const color = pickRandom(VehicleColors);
    const material = new THREE.MeshLambertMaterial({ color });

    // this._trailer = new THREE.Mesh(geom, material);
    // this._trailer = new THREE.Mesh(geom, [
    //   new THREE.MeshLambertMaterial({ map: texture }),
    //   new THREE.MeshLambertMaterial({ map: texture }),
    //   new THREE.MeshLambertMaterial({ map: texture }),
    //   new THREE.MeshLambertMaterial({ map: texture }),
    //   material,
    //   material,
    // ]);

    const materialArr = [];
    materialArr.push(new THREE.MeshLambertMaterial({ map: texture }));
    materialArr.push(new THREE.MeshLambertMaterial({ map: texture }));
    materialArr.push(new THREE.MeshLambertMaterial({ map: texture }));
    materialArr.push(new THREE.MeshLambertMaterial({ map: texture }));
    materialArr.push(new THREE.MeshLambertMaterial({ map: texture }));
    materialArr.push(new THREE.MeshLambertMaterial({ map: texture }));
    // materialArr.push(new THREE.MeshLambertMaterial({ color }));
    // materialArr.push(new THREE.MeshLambertMaterial({ color }));

    this._trailer = new THREE.Mesh(geom, materialArr);
    // this._trailer = new THREE.MeshFaceMaterial(materialArr);

    this._trailer.position.set(-15, 0, 20);
    this._trailer.castShadow = true;
    this._trailer.receiveShadow = true;

    this.add(this._trailer);
  }

  _buildConnector() {
    const geom = new THREE.BoxBufferGeometry(40, 15, 5);
    const material = new THREE.MeshLambertMaterial({ color: 0x999999 });

    this._connector = new THREE.Mesh(geom, material);
    this._connector.position.set(20, 0, 9);

    this.add(this._connector);
  }

  _buildCabin() {
    const color = pickRandom(VehicleColors);
    const frontTexture = this._getCarFrontTexture(color);
    frontTexture.center = new THREE.Vector2(0.5, 0.5);
    frontTexture.rotation = Math.PI / 2;

    const backTexture = this._getCarFrontTexture(color);
    backTexture.center = new THREE.Vector2(0.5, 0.5);
    backTexture.rotation = -Math.PI / 2;

    const rightTexture = this._getCarSideTexture(color);
    const leftTexture = this._getCarSideTexture(color);
    leftTexture.flipY = false;

    const geom = new THREE.BoxBufferGeometry(28, 30, 30);
    const material = new THREE.MeshLambertMaterial({ color });

    this._cabin = new THREE.Mesh(geom, [
      new THREE.MeshLambertMaterial({ map: frontTexture }),
      new THREE.MeshLambertMaterial({ map: backTexture }),
      new THREE.MeshLambertMaterial({ map: leftTexture }),
      new THREE.MeshLambertMaterial({ map: rightTexture }),
      material,
      material,
    ]);

    this._cabin.position.set(40, 0, 20);
    this._cabin.castShadow = true;
    this._cabin.receiveShadow = true;

    this.add(this._cabin);
  }

  _getCarFrontTexture(color) {
    const strColor = this._hexToStr(color);
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    context.fillStyle = `#${strColor}`;
    context.fillRect(0, 0, 64, 32);

    context.fillStyle = "#000000";
    context.fillRect(0, 4, 64, 15);

    return new THREE.CanvasTexture(canvas);
  }

  _getCarSideTexture(color) {
    const strColor = this._hexToStr(color);
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 32;
    const context = canvas.getContext("2d");

    context.fillStyle = `#${strColor}`;
    context.fillRect(0, 0, 128, 32);

    context.fillStyle = "#000000";
    context.fillRect(58, 4, 70, 15);

    return new THREE.CanvasTexture(canvas);
  }

  _getWheel(type) {
    const { x, y, z } = WheelConfig[type];

    const geom = new THREE.BoxBufferGeometry(12, 38, 12);
    const material = new THREE.MeshLambertMaterial({ color: 0x333333 });

    const wheel = new THREE.Mesh(geom, material);
    wheel.position.set(x, y, z);

    wheel.castShadow = false;
    wheel.receiveShadow = false;

    return wheel;
  }

  _hexToStr(color) {
    const colorString = color.toString(16);
    const charArr = colorString.split("").slice(0, 6);
    return charArr.join("");
  }

  //TODO
  showHitZones() {
    if (this.hitZone1) {
      this.zone1 = HitZone();
      this.add(this.zone1);
    }
    if (this.hitZone2) {
      this.zone2 = HitZone();
      this.add(this.zone2);
    }
  }
}
