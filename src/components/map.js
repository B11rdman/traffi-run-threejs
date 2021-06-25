import * as THREE from "three";

const TrackConfig = {
  radius: 225,
  width: 45,
};

export default class Map {
  constructor(renderer) {
    this.renderer = renderer;
    this._setProperties();
    this.renderMap();
  }

  renderMap() {
    const { width, height } = this.renderer.domElement;
    this.plane = this._initPlane(width * 2, height);
    this._initIslands();
  }

  updateSize() {
    if (this.fieldMesh) {
      scene.remove(this.fieldMesh);
      this.fieldMesh = null;
      this._initIslands();
    }
  }

  _initPlane(width, height) {
    const linesTexture = this._getLineMarkings(width * 2, height * 2);
    const planeGeometry = new THREE.PlaneBufferGeometry(width * 2, height * 2);
    const planeMaterial = new THREE.MeshLambertMaterial({ map: linesTexture });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    plane.receiveShadow = true;
    plane.matrixAutoUpdate = false;

    return plane;
  }

  _initIslands() {
    const leftIsland = this._getLeftIsland();
    const rightIsland = this._getRightIsland();
    const middleIsland = this._getMiddleIsland();
    const field = this._getField();

    const fieldGeometry = new THREE.ExtrudeBufferGeometry([leftIsland, middleIsland, rightIsland, field], {
      depth: 16,
      bevelEnabled: false,
    });

    const fieldMesh = new THREE.Mesh(fieldGeometry, [
      new THREE.MeshLambertMaterial({ color: 0x67c240 }),
      new THREE.MeshLambertMaterial({ color: 0x23311c }),
    ]);

    fieldMesh.receiveShadow = true;
    fieldMesh.matrixAutoUpdate = false;

    scene.add((this.fieldMesh = fieldMesh));
  }

  _setProperties() {
    this.radius = TrackConfig.radius;
    this._width = TrackConfig.width;
    this._innerRadius = this.radius - this._width;
    this._outerRadius = this.radius + this._width;

    this._arcAngle1 = (1 / 3) * Math.PI;
    this._deltaY = Math.sin(this._arcAngle1) * this._innerRadius;

    this._arcAngle2 = Math.asin(this._deltaY / this._outerRadius);

    this.arcCenterX =
      (Math.cos(this._arcAngle1) * this._innerRadius + Math.cos(this._arcAngle2) * this._outerRadius) / 2;

    this._arcAngle3 = Math.acos(this.arcCenterX / this._innerRadius);
    this._arcAngle4 = Math.acos(this.arcCenterX / this._outerRadius);
  }

  _getLineMarkings(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");

    context.fillStyle = "#546e90";
    context.fillRect(0, 0, width, height);

    context.lineWidth = 2;
    context.strokeStyle = "#e0ffff";
    context.setLineDash([10, 15]);

    context.beginPath();
    context.arc(width / 2 - this.arcCenterX, height / 2, this.radius, 0, Math.PI * 2);
    context.stroke();

    context.beginPath();
    context.arc(width / 2 + this.arcCenterX, height / 2, this.radius, 0, Math.PI * 2);
    context.stroke();

    return new THREE.CanvasTexture(canvas);
  }

  _getLeftIsland() {
    const island = new THREE.Shape();

    island.absarc(-this.arcCenterX, 0, this._innerRadius, this._arcAngle1, -this._arcAngle1, false);
    island.absarc(this.arcCenterX, 0, this._outerRadius, Math.PI + this._arcAngle2, Math.PI - this._arcAngle2, true);

    return island;
  }

  _getMiddleIsland() {
    const island = new THREE.Shape();

    island.absarc(-this.arcCenterX, 0, this._innerRadius, this._arcAngle3, -this._arcAngle3, true);
    island.absarc(this.arcCenterX, 0, this._innerRadius, Math.PI + this._arcAngle3, Math.PI - this._arcAngle3, true);

    return island;
  }

  _getRightIsland() {
    const island = new THREE.Shape();

    island.absarc(this.arcCenterX, 0, this._innerRadius, Math.PI - this._arcAngle1, Math.PI + this._arcAngle1, true);
    island.absarc(-this.arcCenterX, 0, this._outerRadius, -this._arcAngle2, this._arcAngle2, false);

    return island;
  }

  _getField() {
    const { width, height } = this.renderer.domElement;
    const field = new THREE.Shape();

    field.moveTo(-width * 2, -height);
    field.lineTo(0, -height);

    field.absarc(-this.arcCenterX, 0, this._outerRadius, -this._arcAngle4, this._arcAngle4, true);
    field.absarc(this.arcCenterX, 0, this._outerRadius, Math.PI - this._arcAngle4, Math.PI + this._arcAngle4, true);

    field.lineTo(0, -height);
    field.lineTo(width * 2, -height);
    field.lineTo(width * 2, height);
    field.lineTo(-width * 2, height);

    return field;
  }
}
