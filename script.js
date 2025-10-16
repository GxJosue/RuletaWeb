const canvas = document.getElementById("ruleta");
const ctx = canvas.getContext("2d");
const boton = document.getElementById("boton-girar");
const resultado = document.getElementById("resultado");

const premios = [
  { nombre: "Premio 1", color: "#e63946" },
  { nombre: "Premio 2", color: "#457b9d" },
  { nombre: "Premio 3", color: "#f4a261" },
  { nombre: "Premio 4", color: "#2a9d8f" },
  { nombre: "Premio 5", color: "#264653" }
];

const numSegmentos = premios.length;
const sectorRad = (2 * Math.PI) / numSegmentos;
let girando = false;

// Dibuja la ruleta en base al tamaño actual del canvas
function dibujarRuleta(anguloDeg = 0, resaltar = -1) {
  const size = canvas.clientWidth;
  const radio = size / 2;
  const margen = radio * 0.05;
  const radioAjustado = radio - margen;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(radio, radio);
  ctx.rotate((anguloDeg * Math.PI) / 180);
  ctx.translate(-radio, -radio);

for (let i = 0; i < numSegmentos; i++) {
  const angInicio = i * sectorRad;

  ctx.beginPath();
  ctx.fillStyle = premios[i].color;

  // Si es el segmento ganador, ilumínalo
if (i === resaltar) {
  ctx.shadowColor = "#ffff00"; // amarillo brillante
  ctx.shadowBlur = 60;         // más intenso
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#fff";
  ctx.stroke();                // borde blanco adicional
}

  ctx.moveTo(radio, radio);
  ctx.arc(radio, radio, radioAjustado, angInicio, angInicio + sectorRad);
  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;

  // Texto o imagen
  ctx.save();
  ctx.translate(radio, radio);
  ctx.rotate(angInicio + sectorRad / 2);
  ctx.fillStyle = "#fff";
  ctx.font = `${size * 0.04}px Poppins`;
  ctx.textAlign = "center";
  ctx.fillText(premios[i].nombre, radioAjustado * 0.6, 0);
  ctx.restore();
  
}


  ctx.beginPath();
  ctx.arc(radio, radio, radioAjustado, 0, 2 * Math.PI);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.restore();
}

// Ajusta canvas al ancho del contenedor (responsivo)
function ajustarCanvas() {
  const container = document.querySelector(".ruleta-container");
  const size = container.offsetWidth;
  const ratio = window.devicePixelRatio || 1;

  // Establece el tamaño interno del canvas (para alta resolución)
  canvas.width = size * ratio;
  canvas.height = size * ratio;

  // Establece el tamaño visual del canvas (CSS)
  canvas.style.width = size + "px";
  canvas.style.height = size + "px";

  // Escala el contexto para que todo se dibuje correctamente
  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
  ctx.scale(ratio, ratio);           // Aplica escala

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
  dibujarRuleta(angulo); // ← ahora la rotación se maneja dentro de esta función
  ctx.restore();

if (progreso < 1) {
  requestAnimationFrame(animar);
} else {
  girando = false;
  const anguloGanador = anguloFinal % 360;
  const indice = calcularIndiceGanador(anguloGanador);

  resultado.textContent = `Ganaste: ${premios[indice].nombre}`;
  dibujarRuleta(anguloGanador, indice); // ← resalta el segmento ganador
  confetti({
    particleCount: 150,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#e63946', '#f4a261', '#2a9d8f', '#457b9d', '#ffd700']
  });

}
}
  requestAnimationFrame(animar);
});
