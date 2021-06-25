const container = document.getElementById("container");
const cWidth = 960;
const ratio = container.offsetWidth / container.offsetHeight;

export const CameraConfig = {
  posX: 0,
  posY: -210,
  posZ: 300,
  ratio,
  width: cWidth,
  height: cWidth / ratio,
};

export const VehicleColors = [0xa52523, 0xef2d56, 0x0ad3ff, 0xff9f1c, 0xa52523, 0xbdb638, 0x78b14b];

export function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
