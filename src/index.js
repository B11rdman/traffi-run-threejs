import { Main } from "./main";

function showErrorMessage() {
  const element = document.createElement("div");
  element.style.fontSize = "36px";
  element.style.textAlign = "center";
  element.style.color = "#000";
  element.style.padding = "1.5em";
  element.style.width = "400px";
  element.style.margin = "auto";

  element.innerHTML = "Seems your device does not support WebGL rendering!";
  document.body.appendChild(element);
}

function init() {
  if (!window.WebGLRenderingContext) {
    showErrorMessage();
  } else {
    const container = document.getElementById("container");
    new Main(container);
  }
}

init();
