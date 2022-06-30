// /*********************************************
//  *             SESION 35
//  *          MOTOR FISICO (IV PARTE)
//  *          EDITOR DE NIVELES
//  **********************************************/

var canvas;
var ctx;
var FPS = 50;

var anchoF = 50;
var altoF = 50;

var muro = '#044f14';
var tierra = '#c6892f';


//var puerta = '#3a1700';
//var llave = '#c6bc00';


var protagonista;

var escenario = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0],
  [0, 2, 2, 0, 0, 2, 2, 0, 0, 0, 0, 2, 2, 0, 0],
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0],
  [0, 2, 2, 2, 2, 2, 2, 0, 2, 2, 0, 0, 0, 0, 0],
  [0, 2, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2, 0],
  [0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 2, 2, 0, 2, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]
/**********************************************/
/*******         OBJETOS             **********/
/**********************************************/


//OBJETO JUGADOR
var jugador = function() {

  //Posición en pixels
  this.x = 70;
  this.y = 70;
  this.color = '#820c01';
  // Estado del jugador en un momento dado
  // Velocidad (desplazamiento) en los dos ejes X e Y
  this.vy = 0;
  this.vx = 0;

  //Fuerzas
  this.gravedad = 0.3; // fuerza hacia abajo
  this.friccion = 0.4; // rozamiento del Escenario

  this.salto = 10; // fuerza (en pixels) del juagdor
  this.velocidad = 3; // desplazamiento (en pixels) del jugador
  this.velocidadMax = 5;

  this.suelo = false; // Controla si se debe aplicar o no la gravedad

  // Variables de teclado. Nos aseguramos poder mantener pulsadas teclas derecha e izquierda y al mismo tiempo saltar
  this.pulsaIzquierda = false;
  this.pulsaDerecha = false;

  /*++++++++++++++++++++++++++++++++++++++++++*/
  // METODOS de JUGADOR
  /*++++++++++++++++++++++++++++++++++++++++++*/

  // Este metodo controla si el objeto jugador colisiona con algo en el escenario (Piezas valor=0)
  this.colision = function(x, y) {
    var colisiona = false;
    if (escenario[parseInt(y / altoF)][parseInt(x / anchoF)] == 0) {
      // La division con cociente entero es necesaria para traducir la posicion del jugador en pixels a la posicion del jugador en coordenadas del escenario
      colisiona = true;
    }
    return (colisiona);
  };



  // Este metodo ajusta la posicion del objeto para que encaje exactamente en el cuadro que le corresponde
  this.correccion = function(lugarColision) {

    // Correccion colision Arriba
    if (lugarColision == 1) {
      // +1 é necessário por culpa do redondeo da divisom.
      // Por isso forçamos a que a casilha sume +1, é dizer, seja +1 para abaixo
      this.y = (parseInt(this.y / altoF) + 1) * altoF; // Exemplo: pareseInt(202/50) = 4 * 50 = 200. Pixel 200.
    }

    // Correccion colision Abajo
    if (lugarColision == 2) {
      this.y = parseInt(this.y / altoF) * altoF; // Exemplo: pareseInt(202/50) = 4 * 50 = 200. Pixel 200.
    }

    // Correccion colision Izquierda
    if (lugarColision == 3) {
      this.x = parseInt(this.x / anchoF) * anchoF;
    }

    // Correccion colision Derecha
    if (lugarColision == 4) {
      // +1 é necessário por culpa do redondeo da divisom.
      // Por isso forçamos a que a casilha sume +1, é dizer, seja +1 para a direita
      this.x = (parseInt(this.x / anchoF) + 1) * anchoF;
    }

  };

  // METODO que prueba y aplica los movimientos, la gravedad, las fricciones y colisiones

  this.fisica = function() {
    // gravedad
    if (this.suelo == false) { // Mientras no toque suelo la velocidad vertical aumentará por FOTOGRAMA con la gravedad. Esto simula la acelaracion de la gravedad
      this.vy += this.gravedad;
    }

    // MOVIMIENTO HORIZONTAL
    if (this.pulsaDerecha == true && this.vx <= this.velocidadMax) {
      this.vx += this.velocidad;
    }

    if (this.pulsaIzquierda == true && this.vx >= 0 - (this.velocidadMax)) {
      this.vx -= this.velocidad;
    }

    // FRICCION HORIZONTAL
    // derecha
    if (this.vx > 0) {
      this.vx -= this.friccion;
      if (this.vx < 0) {
        this.vx = 0;
      }
    }
    // izquierda
    if (this.vx < 0) {
      this.vx += this.friccion;

      if (this.vx > 0) {
        this.vx = 0;
      }
    }


    // COLISIONES
    //    Colision Izquierda
    if (this.vx < 0) {
      if ((this.colision(this.x + this.vx, this.y + 1) == true) || (this.colision(this.x + this.vx, this.y + altoF - 1) == true)) {

        if (this.x != parseInt(this.x / anchoF) * anchoF) { // Evita la correccion cuando el objeto coincide exactamente con la casilla
          this.correccion(3);
        }

        this.vx = 0;
      }
    }

    // Colision Derecha
    if (this.vx > 0) {

      if ((this.colision(this.x + anchoF + this.vx, this.y + 1) == true) || (this.colision(this.x + anchoF + this.vx, this.y + altoF - 1) == true)) {

        if (this.x != parseInt(this.x / anchoF) * anchoF) { // Evita la correccion cuando el objeto coincide exactamente con la casilla
          this.correccion(4);
        }

        this.vx = 0;
      }
    }

    /**IMPORTANTE: É necessário aplicar o movemento vertical antes de que se comprove a colisom
    porque, se nom, o movemento fica sempre em 0 ***/

    // APLICA MOVIMIENTO
    this.y += this.vy; // El eje vertical se incrementa (cae) por la velocidad vertical de la gravedad. Esto simula la caida acelarada.
    this.x += this.vx // El eje horizontal. La velocidad está limitada por "this.velocidadMax"


    // Colision ARRIBA
    if (this.vy < 0) {
      if ((this.colision(this.x + 1, this.y) == true) || (this.colision(this.x + anchoF - 1, this.y) == true)) {
        this.vy = 0;
        this.correccion(1);
      }

    }

    // Colision ABAJO. El objeto se para al llegar al suelo
    //  +altoF para controlar la base del objeto // +anchoF para controlar la esquina derecha.
    if (this.vy >= 0) { // Impide que se ajuste por debaixo quando está subindo
      if ((this.colision(this.x + 1, this.y + altoF) == true) || (this.colision(this.x + anchoF - 1, this.y + altoF) == true)) {
        this.suelo = true; // la gravedad deja de actuar
        this.vy = 0; // desplazamiento vertical = 0
        this.correccion(2);
      } else {
        this.suelo = false;
      }
    }

  }; //FIM METODO FISICA


  // METODOS TECLADO
  this.arriba = function() {
    if (this.suelo == true) {
      this.vy -= this.salto;
      this.suelo = false;
      console.log('NO AR!!!!!!');
    }
  };

  this.derecha = function() {
    this.pulsaDerecha = true;
    console.log('DIREITA');
  };

  this.izquierda = function() {
    this.pulsaIzquierda = true;
    console.log('ESQUERDA');
  };

  this.derechaSuelta = function() {
    this.pulsaDerecha = false;
  };

  this.izquierdaSuelta = function() {
    this.pulsaIzquierda = false;
  };


  // METODO DIBUJA

  this.dibuja = function() {

    this.fisica();

    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, anchoF, altoF);
  };
};






/**********************************************/
/*******         FUNCIONES             ********/
/**********************************************/


var ratonX = 0;
var ratonY = 0;

function clicRaton(objeto) {};

function sueltaRaton(objeto) {
  creaBloque(ratonX, ratonY);
};

function posicionRaton(objeto) {
  ratonX = objeto.pageX;
  ratonY = objeto.pageY;
  console.log(ratonX + ' - ' + ratonY);
};

//------------------------------------------------
//------------------------------------------------
/*FUNCIONES EDITOR con RATON*/
function creaBloque(x, y) {
  var xBloque = parseInt(x / anchoF);
  var yBloque = parseInt(y / altoF);
  var colorBloque = escenario[yBloque][xBloque];

  if (colorBloque == 0) {
    colorBloque = 2;
  } else {
    colorBloque = 0;
  }

  escenario[yBloque][xBloque] = colorBloque;

};

function predibujaBloque() {
  ctx.fillStyle = '#666666';
  ctx.fillRect(parseInt(ratonX / anchoF) * anchoF, parseInt(ratonY / altoF) * altoF, anchoF, altoF);
};
//------------------------------------------------
//------------------------------------------------

function dibujaEscenario() {
  var color;

  for (y = 0; y < 10; y++) {
    for (x = 0; x < 15; x++) {

      if (escenario[y][x] == 0)
        color = muro;

      if (escenario[y][x] == 2)
        color = tierra;

      ctx.fillStyle = color;
      ctx.fillRect(x * anchoF, y * altoF, anchoF, altoF);
    }
  }
};

function inicializa() {
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  //CREAMOS AL JUGADOR
  protagonista = new jugador();

  // LECTURA DEL RATON (solo en el canvas)
  canvas.addEventListener('mousedown', clicRaton, false);
  canvas.addEventListener('mouseup', sueltaRaton, false);
  canvas.addEventListener('mousemove', posicionRaton, false);

  //LECTURA DEL TECLADO
  document.addEventListener('keydown', function(tecla) {

    if (tecla.keyCode == 38) {
      //arriba
      protagonista.arriba();
    }
    if (tecla.keyCode == 37) {
      //izquierda
      protagonista.izquierda();
      console.log('pulsa izquierda');
    }
    if (tecla.keyCode == 39) {
      //derecha
      protagonista.derecha();
      console.log('pulsa derecha');
    }
  });

  // LIBERACION TECLAS
  document.addEventListener('keyup', function(tecla) {
    if (tecla.keyCode == 37) {
      //izquierda
      protagonista.izquierdaSuelta();
      console.log('suelta izquierda');
    }
    if (tecla.keyCode == 39) {
      //derecha
      protagonista.derechaSuelta();
      console.log('suelta derecha');
    }
  });

  setInterval(function() {
    principal();
  }, 1000 / FPS);
};


function borraCanvas() {
  canvas.width = 750;
  canvas.height = 500;
};


function principal() {
  borraCanvas();
  dibujaEscenario();
  predibujaBloque();
  protagonista.dibuja();
};
