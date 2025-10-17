const canvas = document.getElementById("ruleta");
const ctx = canvas.getContext("2d");
const boton = document.getElementById("boton-girar");
const resultado = document.getElementById("resultado");
let giroContador = 3;

const premios = [
  { nombre: "SELLADORA", color: "#264653", imagen: "img/selladora.png" },
  { nombre: "SIGUE GIRANDO", color: "#51cbfcff", imagen: "img/sigue-girando.png" },
  { nombre: "REGALO SORPRESA", color: "#e63946", imagen: "img/gift.png" },
  { nombre: "5% DE DESCUENTO", color: "#457b9d", imagen: "img/descuento.png" },
  { nombre: "SMARTWATCH", color: "#f4a261", imagen: "img/smartwatch.png" },
  { nombre: "15% DE DESCUENTO", color: "#51cbfcff", imagen: "img/descuento.png" }
];
const imagenes = premios.map(p => {
  const img = new Image();
  img.src = p.imagen;
  return img;
});

function cargarImagenes(callback) {
  let cargadas = 0;
  const total = imagenes.length;

  imagenes.forEach((img) => {
    if (img.complete) {
      cargadas++;
      if (cargadas === total) callback();
    } else {
      img.onload = () => {
        cargadas++;
        if (cargadas === total) callback();
      };
    }
  });
}
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
  ctx.shadowColor = "#ffff00"; 
  ctx.shadowBlur = 60;         
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#fff";
  ctx.stroke();                
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

// 🔹 Tamaño de imagen
let imgSize = canvas.clientWidth * 0.15;
const nombrePremio = premios[i].nombre;

// Aumenta el tamaño solo para smartwatch y selladora
if (nombrePremio.includes("SMARTWATCH") || nombrePremio.includes("SELLADORA")) {
  imgSize = canvas.clientWidth * 0.18; 
}

// 🔹 Dibuja la imagen arriba
const img = imagenes[i];
if (img && img.complete) {
  ctx.drawImage(
    img,
    radioAjustado * 0.6 -imgSize / 2 + 5, 
    -imgSize - 5,                    
    imgSize,
    imgSize
  );
}

// 🔹 Dibuja el texto debajo
ctx.fillStyle = "#fff";
ctx.font = `${size * 0.030}px Orbitron`;
ctx.textAlign = "center";
ctx.fillText(premios[i].nombre, radioAjustado * 0.6, 10); 

ctx.restore();
  
}

  ctx.beginPath();
  ctx.arc(radio, radio, radioAjustado, 0, 2 * Math.PI);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 4;
  ctx.stroke();

  if (logoCentral.complete) {
  const logoSize = canvas.clientWidth * 0.35; 
  ctx.drawImage(
    logoCentral,
    radio - logoSize / 2,
    radio - logoSize / 2,
    logoSize,
    logoSize
  );
} else {
  logoCentral.onload = () => {
    ajustarCanvas(); 
  };
}

  ctx.restore();
}

  const logoCentral = new Image();
logoCentral.src = "img/logo.png"; 

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
  ctx.setTransform(1, 0, 0, 1, 0, 0); 
  ctx.scale(ratio, ratio);           

  dibujarRuleta();
}

window.addEventListener("resize", ajustarCanvas);
cargarImagenes(() => {
  ajustarCanvas(); 
});

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
const sectorDeg = 360 / numSegmentos;
let indiceGanador;

if (giroContador === 3) {
  
  indiceGanador = 1;
} else if (giroContador === 2) {
  
  indiceGanador = 3;
} else if (giroContador === 1) {
  
  indiceGanador = 0;
} else {
  indiceGanador = Math.floor(Math.random() * numSegmentos);
}

// Calcula el ángulo que posiciona el segmento en 270°
const desplazamientoVisual = sectorDeg * -0.4; 
const destino = 270 - (indiceGanador * sectorDeg) + desplazamientoVisual;
const anguloFinal = 360 * vueltas + destino;
giroContador = Math.max(giroContador - 1, 0); 


  const duracion = 4200;
  const inicio = performance.now();

function animar(tiempo) {
  const progreso = Math.min((tiempo - inicio) / duracion, 1);
  const easing = 1 - Math.pow(1 - progreso, 3);
  const angulo = anguloFinal * easing;

  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  dibujarRuleta(angulo); 
  ctx.restore();

if (progreso < 1) {
  requestAnimationFrame(animar);
} else {
  girando = false;
const anguloGanador = anguloFinal % 360;
resultado.textContent = `Ganaste: ${premios[indiceGanador].nombre}`;
dibujarRuleta(anguloGanador, indiceGanador);
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
