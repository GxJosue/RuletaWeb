const canvas = document.getElementById("ruleta");
const ctx = canvas.getContext("2d");
const boton = document.getElementById("boton-girar");
const resultado = document.getElementById("resultado");

const premios = ["Premio 1", "Premio 2", "Premio 3", "Premio 4", "Premio 5", "Premio 6"];
const numSegmentos = premios.length;
const sectorRad = (2 * Math.PI) / numSegmentos;
let girando = false;

// Dibuja la ruleta en base al tamaño actual del canvas
function dibujarRuleta() {
  const radio = Math.min(canvas.width, canvas.height) / 2;
  const margen = radio * 0.05; // margen interno para que no se salga
  const radioAjustado = radio - margen;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < numSegmentos; i++) {
    const angInicio = i * sectorRad;

    ctx.beginPath();
    ctx.fillStyle = i % 2 ? "#e63946" : "#457b9d";
    ctx.moveTo(radio, radio);
    ctx.arc(radio, radio, radioAjustado, angInicio, angInicio + sectorRad);
    ctx.closePath();
    ctx.fill();

    // Texto centrado proporcional
    ctx.save();
    ctx.translate(radio, radio);
    ctx.rotate(angInicio + sectorRad / 2);
    ctx.fillStyle = "#fff";
    ctx.font = `${radio * 0.08}px Poppins`;
    ctx.textAlign = "center";
    ctx.fillText(premios[i], radioAjustado * 0.6, 0);
    ctx.restore();
  }

  // Opcional: borde exterior
  ctx.beginPath();
  ctx.arc(radio, radio, radioAjustado, 0, 2 * Math.PI);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 4;
  ctx.stroke();
}

// Ajusta canvas al ancho del contenedor (responsivo)
function ajustarCanvas() {
  const container = document.querySelector(".ruleta-container");
  const size = container.offsetWidth;
  const ratio = window.devicePixelRatio || 1;

  canvas.width = size * ratio;
  canvas.height = size * ratio;
  canvas.style.width = size + "px";
  canvas.style.height = size + "px";

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  dibujarRuleta();
}

window.addEventListener("resize", ajustarCanvas);
ajustarCanvas();

// Función para obtener el índice ganador dado el ángulo total (en grados)
function calcularIndiceGanador(anguloTotalDeg) {
  const rot = ((anguloTotalDeg % 360) + 360) % 360;
  const sectorDeg = 360 / numSegmentos;
  const offset = 270;
  return Math.floor(((offset - rot + 360) % 360) / sectorDeg);
}

// Animación de giro y cálculo de resultado
boton.addEventListener("click", () => {
  if (girando) return;
  girando = true;
  resultado.textContent = "";

  const vueltas = Math.floor(Math.random() * 3) + 5;
  const destino = Math.random() * 360;
  const anguloFinal = 360 * vueltas + destino;
  const duracion = 4200;
  const inicio = performance.now();

  function animar(tiempo) {
    const progreso = Math.min((tiempo - inicio) / duracion, 1);
    const easing = 1 - Math.pow(1 - progreso, 3);
    const angulo = anguloFinal * easing;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const ratio = window.devicePixelRatio || 1;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    ctx.translate(cx, cy);
    ctx.rotate((angulo * Math.PI) / 180);
    ctx.translate(-cx, -cy);

    dibujarRuleta();
    ctx.restore();

    if (progreso < 1) {
      requestAnimationFrame(animar);
    } else {
      girando = false;
      const anguloGanador = anguloFinal % 360;
      const indice = calcularIndiceGanador(anguloGanador);
      resultado.textContent = `Ganaste: ${premios[indice]} `;
    }
  }

  requestAnimationFrame(animar);
});
