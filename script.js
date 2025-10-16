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
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < numSegmentos; i++) {
    const angInicio = i * sectorRad;

    ctx.beginPath();
    ctx.fillStyle = i % 2 ? "#e63946" : "#457b9d";
    ctx.moveTo(radio, radio);
    ctx.arc(radio, radio, radio, angInicio, angInicio + sectorRad);
    ctx.closePath();
    ctx.fill();

    // Texto centrado proporcional
    ctx.save();
    ctx.translate(radio, radio);
    ctx.rotate(angInicio + sectorRad / 2);
    ctx.fillStyle = "#fff";
    ctx.font = `${radio * 0.08}px Poppins`; // tamaño proporcional al radio
    ctx.textAlign = "center";
    ctx.fillText(premios[i], radio * 0.6, 0);
    ctx.restore();
  }
}


// Ajusta canvas al ancho del contenedor (responsivo)
function ajustarCanvas() {
  const container = document.querySelector(".ruleta-container");
  const size = container.offsetWidth;
  // usar devicePixelRatio para evitar blur en pantallas HiDPI
  const ratio = window.devicePixelRatio || 1;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;
  canvas.width = Math.floor(size * ratio);
  canvas.height = Math.floor(size * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0); // escalar contexto
  dibujarRuleta();
}
window.addEventListener("resize", ajustarCanvas);
ajustarCanvas();

// Función para obtener el índice ganador dado el ángulo total (en grados)
function calcularIndiceGanador(anguloTotalDeg) {
  // normaliza
  const rot = ((anguloTotalDeg % 360) + 360) % 360;
  const sectorDeg = 360 / numSegmentos;
  // El puntero (flecha) está arriba; en sistema de ángulos del canvas,
  // el "arriba" corresponde a 270°. Por eso usamos 270 como offset.
  const offset = 270;
  const indice = Math.floor(((offset - rot + 360) % 360) / sectorDeg);
  return indice;
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
