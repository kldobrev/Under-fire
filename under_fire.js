FIELD_HEIGHT = 520;
FIELD_WIDTH = 720;
FIELD_BACKGROUND = "#000000";
PLAYER_X = 90;
PLAYER_Y = 450;
PLAYER_COLOR = "#FFFFFF";
PLAYER_WIDTH = 10;
PLAYER_SPEED = 4;
GUN_OFFSET = 20;


function startGame() {
  game_field.init_field();
  player.init_player(PLAYER_X, PLAYER_Y, PLAYER_COLOR, PLAYER_WIDTH, PLAYER_SPEED);
}

var game_field = { 

  canvas : document.createElement("canvas"),
  
  init_field : function() {
    this.canvas.height = FIELD_HEIGHT;
    this.canvas.width = FIELD_WIDTH;
    this.canvas.style.background = FIELD_BACKGROUND;
    this.canvas.context = this.canvas.getContext("2d");
    this.guns = [new Gun(GUN_OFFSET, 5, 5, true, false)];
    this.guns[1] = new Gun(GUN_OFFSET, 5, 5, true, true);
    this.guns[2] = new Gun(GUN_OFFSET, 5, 5, false, false);
    this.guns[3] = new Gun(GUN_OFFSET, 5, 5, false, true);
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    

    this.interval = setInterval(updateField, 20);

    window.addEventListener("keydown", function(ev) {
      game_field.keys = (game_field.keys || []);
      game_field.keys[ev.keyCode] = true;
    })

    window.addEventListener("keyup", function(ev) {
      game_field.keys[ev.keyCode] = false;
    })
    
  },

  clear : function() {
    this.canvas.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

}

var player = {

  lives : 3,

  init_player : function(x, y, color, width, speed) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.width = width;
    this.speed = speed;
  },

  draw_player : function() {
    context = game_field.canvas.context;
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.width);
  },

  go_left : function(speed) {
    if(player.x >= 0) player.x -= this.speed;
  },

  go_right : function(speed) {
    if((player.x + player.width) < FIELD_WIDTH) player.x += this.speed;
  },

  go_up : function(speed) {
    if(player.y >= 0) player.y -= this.speed;
  },

  go_down : function(speed) {
    if((player.y + player.width) < FIELD_HEIGHT)player.y += this.speed;
  }

}

function Gun(offset, rad, speed, is_vert, is_oposite) {

  this.offset = offset;
  this.radius = rad;
  this.speed = speed;
  this.is_vert = is_vert;
  this.is_oposite = is_oposite;
  this.direction = this.is_oposite ? -1 : 1;

  // Calculating initial coordinates based on gun type
  if(is_vert) {
    this.x = this.is_oposite ? (FIELD_WIDTH - this.offset) : this.offset;
    this.y = Math.round(FIELD_HEIGHT / 2);
  } else {
    this.x = Math.round(FIELD_WIDTH / 2);
    this.y = this.is_oposite ? (FIELD_HEIGHT - this.offset) : this.offset;
  }

  this.draw = function() {
    context = game_field.canvas.context;
    context.beginPath();
    context.fillStyle = "#FF0000";
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
  }

  this.move = function() {
    if(is_vert) {
      this.direction *= (((this.direction > 0 && (this.y == (FIELD_HEIGHT - this.offset)))
          || (this.direction < 0 && (this.y == this.offset))) ? -1 : 1);
      this.y += (this.speed * this.direction);
    } else {
      this.direction *= (((this.direction > 0 && (this.x == (FIELD_WIDTH - this.offset)))
          || (this.direction < 0 && (this.x == this.offset))) ? -1 : 1);
      this.x += (this.speed * this.direction); 
    }
  }
  
}

function updateField() {
  game_field.clear();
  for(var i = 0; i < game_field.guns.length; i++) {
    game_field.guns[i].draw();
    game_field.guns[i].move();
  }
  if(game_field.keys && game_field.keys[37]) player.go_left();
  if(game_field.keys && game_field.keys[39]) player.go_right();
  if(game_field.keys && game_field.keys[38]) player.go_up();
  if(game_field.keys && game_field.keys[40]) player.go_down();
  player.draw_player();
}

