import * as THREE from "three";
import Camera from "./components/camera";
import Car from "./components/car";
import Light from "./components/light";
import Map from "./components/map";
import Renderer from "./components/renderer";
import Truck from "./components/truck";
import { pickRandom } from "./config";

export class Main {
  constructor(container) {
    window.scene = this.scene = new THREE.Scene();
    this.container = container;
    this._initMainComponents();

    this.container.appendChild(this.renderer.threeRenderer.domElement);

    this._render();

    this._isReady = null;
    this._playerAngleMoved = null;
    this._playerAngleInitial = Math.PI;
    this._score = null;
    this._otherVehicles = [];
    this._lastTimestamp = null;
    this._accelerate = false;
    this._decelerate = false;

    this._playerCar = new Car();
    this._playerCar.speed = 0.0015;
    this._speed = 0.0017;
    this.scene.add(this._playerCar);

    this._reset();
    this._setEvents();
  }

  _render() {
    requestAnimationFrame(this._render.bind(this));

    this.renderer.render(this.scene, this.camera.threeCamera);
  }

  _initMainComponents() {
    this.renderer = new Renderer(this.scene, this.container);
    this.camera = new Camera(this.renderer.threeRenderer);
    this.map = new Map(this.renderer.threeRenderer);
    this.light = new Light();

    this.scene.add(this.map.plane);
    this.light.addLights(this.scene);

    this.camera.threeCamera.lookAt(0, 0, 0);
  }

  _reset() {
    this._playerAngleMoved = 0;
    this._score = 0;

    this._otherVehicles.forEach((v) => {
      this.scene.remove(v.mesh);
      if (v.mesh.userData.hitZone1) scene.remove(v.mesh.userData.hitZone1);
      if (v.mesh.userData.hitZone2) scene.remove(v.mesh.userData.hitZone2);
      if (v.mesh.userData.hitZone3) scene.remove(v.mesh.userData.hitZone3);
    });
    this._otherVehicles = [];
    this._lastTimestamp = undefined;
    this._movePlayerCar(0);
    this.renderer.render(this.scene, this.camera.threeCamera);
    this._isReady = true;
  }

  _startGame() {
    if (this._isReady) {
      this._isReady = false;
      this.renderer.threeRenderer.setAnimationLoop(this._animation.bind(this));
    }
  }

  _animation(timestamp) {
    if (!this._lastTimestamp) {
      this._lastTimestamp = timestamp;
      return;
    }

    const timeDelta = timestamp - this._lastTimestamp;
    this._movePlayerCar(timeDelta);

    const laps = Math.floor(Math.abs(this._playerAngleMoved) / (Math.PI * 2));

    if (laps !== this._score) this._score = laps;
    if (this._otherVehicles.length < (laps + 1) / 5) this._addVehicle();

    this._moveOtherVehicles(timeDelta);
    this._hitDetection();

    this.renderer.render(this.scene, this.camera.threeCamera);
    this._lastTimestamp = timestamp;
  }

  _movePlayerCar(delta) {
    const { radius, arcCenterX } = this.map;
    const speed = this._getPlayerSpeed();
    this._playerAngleMoved -= speed * delta;

    const totalPlayerAngle = this._playerAngleInitial + this._playerAngleMoved;

    const playerX = Math.cos(totalPlayerAngle) * radius - arcCenterX;
    const playerY = Math.sin(totalPlayerAngle) * radius;
    this._playerCar.position.x = playerX;
    this._playerCar.position.y = playerY;

    this._playerCar.rotation.z = totalPlayerAngle - Math.PI / 2;
  }

  _addVehicle() {
    const types = ["car", "truck"];

    const type = pickRandom(types);
    const speed = this._getVehicleSpeed(type);
    const clockwise = Math.random() >= 0.5;
    const angle = clockwise ? Math.PI / 2 : -Math.PI / 2;
    const mesh = type === "car" ? new Car() : new Truck();

    const { radius, arcCenterX } = this.map;

    const vX = Math.cos(angle) * radius + arcCenterX;
    const vY = Math.sin(angle) * radius;
    const rot = angle + (clockwise ? -Math.PI / 2 : Math.PI / 2);

    mesh.position.x = vX;
    mesh.position.y = vY;
    mesh.rotation.z = rot;

    this.scene.add(mesh);

    this._otherVehicles.push({ mesh, type, speed, clockwise, angle });
  }

  _hitDetection() {
    const playerHitZone1 = this._getHitZonePosition(
      this._playerCar.position,
      this._playerAngleInitial + this._playerAngleMoved,
      true,
      15
    );

    const playerHitZone2 = this._getHitZonePosition(
      this._playerCar.position,
      this._playerAngleInitial + this._playerAngleMoved,
      true,
      -15
    );

    const hit = this._otherVehicles.some((v) => {
      if ((v.type = "car")) {
        const carHitZone1 = this._getHitZonePosition(v.mesh.position, v.angle, v.clockwise, 15);
        const carHitZone2 = this._getHitZonePosition(v.mesh.position, v.angle, v.clockwise, -15);

        if (this._getDistance(playerHitZone1, carHitZone1) < 40) return true;
        if (this._getDistance(playerHitZone1, carHitZone2) < 40) return true;
        if (this._getDistance(playerHitZone2, carHitZone1) < 40) return true;
      }

      if ((v.type = "truck")) {
        const truckHitZone1 = this._getHitZonePosition(v.mesh.position, v.angle, v.clockwise, 35);
        const truckHitZone2 = this._getHitZonePosition(v.mesh.position, v.angle, v.clockwise, 0);

        if (this._getDistance(playerHitZone1, truckHitZone1) < 40) return true;
        if (this._getDistance(playerHitZone1, truckHitZone2) < 40) return true;
        if (this._getDistance(playerHitZone1, truckHitZone3) < 40) return true;
        if (this._getDistance(playerHitZone2, truckHitZone1) < 40) return true;
      }
    });

    if (hit) this.renderer.threeRenderer.setAnimationLoop(null);
  }

  _getDistance(cord1, cord2) {
    return Math.sqrt(cord2.x - cord1.x) ** 2 + (cord2.y - cord1.y) ** 2;
  }

  _getHitZonePosition(center, angle, clockwise, distance) {
    const directionAngle = angle + (clockwise ? -Math.PI / 2 : Math.PI / 2);
    const x = center.x + Math.cos(directionAngle) * distance;
    const y = center.y + Math.sin(directionAngle) * distance;

    return {
      x,
      y,
    };
  }

  _moveOtherVehicles(delta) {
    const { radius, arcCenterX } = this.map;
    this._otherVehicles.forEach((v) => {
      if (v.clockwise) {
        v.angle -= this._speed * delta * v.speed;
      } else {
        v.angle += this._speed * delta * v.speed;
      }

      const vX = Math.cos(v.angle) * radius + arcCenterX;
      const vY = Math.sin(v.angle) * radius;
      const rot = v.angle + (v.clockwise ? -Math.PI / 2 : Math.PI / 2);

      v.mesh.position.x = vX;
      v.mesh.position.y = vY;
      v.mesh.rotation.z = rot;
    });
  }

  _getVehicleSpeed(type) {
    let min = 1;
    let max = 1.7;
    switch (type) {
      case "car":
        return min + Math.random() * (max - min);
      case "truck":
        min = 0.5;
        max = 1.2;
        return min + Math.random() * (max - min);

      default:
        break;
    }
  }

  _getPlayerSpeed() {
    const { speed } = this._playerCar;
    if (this._accelerate) return speed * 2;
    if (this._decelerate) return speed * 0.5;
    return speed;
  }

  _setEvents() {
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowUp":
          this._startGame();
          this._accelerate = true;
          break;
        case "ArrowDown":
          this._decelerate = true;
          break;
        case "R":
        case "r":
          this._reset();
          break;
        default:
          break;
      }
    });

    window.addEventListener("keyup", (e) => {
      switch (e.key) {
        case "ArrowUp":
          this._accelerate = false;
          break;
        case "ArrowDown":
          this._decelerate = false;
          break;
        default:
          break;
      }
    });

    window.addEventListener("resize", () => {
      const { cameraWidth } = this.camera.threeCamera;
      const newAspectRatio = this.container.offsetWidth / this.container.offsetHeight;
      const adjustedCameraHeight = cameraWidth / newAspectRatio;

      this.camera.threeCamera.top = adjustedCameraHeight / 2;
      this.camera.threeCamera.bottom = adjustedCameraHeight / -2;
      this.camera.threeCamera.updateProjectionMatrix();

      this.renderer.updateSize();
      this.map.updateSize();
      this.renderer.threeRenderer.render(this.scene, this.camera.threeCamera);
    });
  }
}
