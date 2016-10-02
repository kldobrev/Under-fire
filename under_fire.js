FIELD_HEIGHT = 520;
FIELD_WIDTH = 720;
FIELD_BACKGROUND = "#000000";
PLAYER_X = 90;
PLAYER_Y = 450;
PLAYER_COLOR = "#FFFFFF";
PLAYER_WIDTH = 10;
PLAYER_SPEED = 4;
GUN_OFFSET = 20;
GUN_COLOR="#FF0000";
GUN_RAD = 6;
GUN_SPEED = 7;
FIRE_SPEED = 4; 
// Max horizontal distance between the gun and the player
MAX_GUNPL_DIST_WIDTH = FIELD_WIDTH - (GUN_OFFSET * 2);
// Least horizontal distance between the gun and the player
// required in order for the gun to shoot
DIST_TOLERANCE = MAX_GUNPL_DIST_WIDTH / 6;
HALL_WIDTH = 40;
EXIT_IMG = "exit.png";
OBS_COLOR = "#66FFFF";


function initGame() {
  game_field.initField();
}

function startGame() {
  game_panel.initPanelVals();
  game_field.playGame();
}

function prepareRestart() { 
  clearInterval(game_field.interval);
  game_field.keys = [];
}

var game_panel = {

  initPanelVals : function() {
    this.score_tracker = document.getElementById("scoreboard").childNodes[1];
  },

  updateScore : function(score) {
    this.score_tracker.innerHTML = score;
  }

}

var game_field = { 

  canvas : document.createElement("canvas"),

  initField : function() {
    this.canvas.height = FIELD_HEIGHT;
    this.canvas.width = FIELD_WIDTH;
    this.canvas.style.background = FIELD_BACKGROUND;
    this.canvas.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  },
  
  playGame : function() {
    this.guns = [new Gun(GUN_OFFSET, GUN_RAD, GUN_SPEED, true, false)];
    this.guns[1] = new Gun(GUN_OFFSET, GUN_RAD, GUN_SPEED, true, true);
    this.guns[2] = new Gun(GUN_OFFSET, GUN_RAD, GUN_SPEED, false, false);
    this.guns[3] = new Gun(GUN_OFFSET, GUN_RAD, GUN_SPEED, false, true);

    this.obstacles = [new Obstacle(0, 500, 720, 1, GUN_COLOR)];
    this.obstacles[1] = new Obstacle(0, 20, 720, 1, GUN_COLOR);
    this.obstacles[2] = new Obstacle(20, 0, 1, 520, GUN_COLOR);
    this.obstacles[3] = new Obstacle(700, 0, 1, 520, GUN_COLOR);

    this.obstacles[4] = new Obstacle(100, 100, 517, 3, OBS_COLOR);
    this.obstacles[5] = new Obstacle(100, 103, 3, 317, OBS_COLOR);
    this.obstacles[6] = new Obstacle(100, 420, 520, 3, OBS_COLOR);
    this.obstacles[7] = new Obstacle(617, 100, 3, 280, OBS_COLOR);
    this.obstacles[8] = new Obstacle(144, 380, 476, 3, OBS_COLOR);
    this.obstacles[9] = new Obstacle(144, 144, 3, 236, OBS_COLOR);
    this.obstacles[10] = new Obstacle(144, 144, 430, 3, OBS_COLOR);
    this.obstacles[11] = new Obstacle(574, 144, 3, 196, OBS_COLOR);
    this.obstacles[12] = new Obstacle(187, 340, 390, 3, OBS_COLOR);
    this.obstacles[13] = new Obstacle(187, 186, 3, 156, OBS_COLOR);
    this.obstacles[14] = new Obstacle(187, 183, 347, 3, OBS_COLOR);
    this.obstacles[15] = new Obstacle(534, 183, 3, 116, OBS_COLOR);
    this.obstacles[16] = new Obstacle(227, 299, 310, 3, OBS_COLOR);
    this.obstacles[17] = new Obstacle(227, 223, 3, 76, OBS_COLOR);
    this.obstacles[18] = new Obstacle(227, 223, 270, 3, OBS_COLOR);
    this.obstacles[19] = new Obstacle(497, 223, 3, 40, OBS_COLOR);
    this.obstacles[20] = new Obstacle(270, 263, 230, 3, OBS_COLOR);
    this.obstacles[21] = new Obstacle(270, 243, 3, 20, OBS_COLOR);
    this.obstacles[22] = new Obstacle(270, 240, 227, 3, OBS_COLOR);

    exit_door.initDoor();
    player.initPlayer(PLAYER_X, PLAYER_Y, PLAYER_COLOR, PLAYER_WIDTH, PLAYER_SPEED);

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

  initPlayer : function(x, y, color, width, speed) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.width = width;
    this.speed = speed;
    this.centerX = this.x + (this.width / 2);
    this.centerY = this.y + (this.width / 2);
    this.score = 0;
  },

  draw : function() {
    context = game_field.canvas.context;
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.width);
  },

  goLeft : function(speed = 0) {
    if(this.x >= 0) {
      this.x -= speed;
      this.centerX -= speed;
    }
  },

  goRight : function(speed = this.speed) {
    if((this.x + this.width) < FIELD_WIDTH) {
      this.x += speed;
      this.centerX += speed;
    }
  },

  goUp : function(speed = this.speed) {
    if(this.y >= 0) {
      this.y -= speed;
      this.centerY -= speed;
    }
  },

  goDown : function(speed = this.speed) {
    if((this.y + this.width) < FIELD_HEIGHT) {
      this.y += speed;
      this.centerY += speed;
    }
  }

}

var exit_door = {

  initDoor : function() {
    this.x = 461;
    this.y = 226;
    this.width = 36;
    this.height = 16;
    this.image = new Image();
    this.image.src = EXIT_IMG;
  },

  draw : function() {
    var context = game_field.canvas.context;
    context.drawImage(this.image, this.x, this.y);
  }

}

function Gun(offset, rad, speed, is_vert, is_oposite) {

  this.offset = offset;
  this.radius = rad;
  this.speed = speed;
  this.is_vert = is_vert;
  this.is_oposite = is_oposite;
  this.direction = this.is_oposite ? -1 : 1;
  this.projectile = null;

  // Calculating initial coordinates based on gun type
  if(is_vert) {
    this.x = this.is_oposite ? (FIELD_WIDTH - this.offset) : this.offset;
    this.y = Math.round(FIELD_HEIGHT / 2);
    this.gunX = this.is_oposite ? (this.x - 9) : (this.x + 9);
    this.gunY = this.y;
  } else {
    this.x = Math.round(FIELD_WIDTH / 2);
    this.y = this.is_oposite ? (FIELD_HEIGHT - this.offset) : this.offset;
    this.gunX = this.x;
    this.gunY = this.is_oposite ? (this.y - 9) : (this.x + 9);
  }

  this.draw = function() {
    context = game_field.canvas.context;
    context.beginPath();
    context.fillStyle = GUN_COLOR;
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
  }

  this.move = function() {
    if(is_vert) {
      this.direction *= (((this.direction > 0 && (this.y >= (FIELD_HEIGHT - this.offset)))
          || (this.direction < 0 && (this.y <= this.offset))) ? -1 : 1);
      this.y += (this.speed * this.direction);
    } else {
      this.direction *= (((this.direction > 0 && (this.x >= (FIELD_WIDTH - this.offset)))
          || (this.direction < 0 && (this.x <= this.offset))) ? -1 : 1);
      this.x += (this.speed * this.direction); 
    }
    var targetX = Math.round(player.width / 2) + player.x;
    var targetY = Math.round(player.width / 2) + player.y;
    if( ((!this.projectile) || this.projectile.is_out_of_bounds()) 
      && (Math.abs(this.x - targetX) > DIST_TOLERANCE) ) { 
      player.score++;
      game_panel.updateScore(player.score);
      this.projectile = new Projectile(this, targetX, targetY, FIRE_SPEED);
    } else if(this.projectile) {
      this.projectile.move();
    }
  }
  
}

function Projectile(gun, targX, targY, sp) {

  this.gun = gun;
  this.x = this.gun.x;
  this.y = this.gun.y;
  this.width = 2;
  this.initX = this.x;
  this.initY = this.y;
  this.targetX = targX;
  this.targetY = targY;
  this.speed = sp;
  this.slope = (this.targetY - this.initY) / (this.targetX - this.initX);
  this.y_intercept = (this.targetY - (this.slope * this.targetX));

  this.is_out_of_bounds = function() {
    return this.x < 0 || this.x > FIELD_WIDTH || this.y < 0 || this.y > FIELD_HEIGHT;
  }

  this.move = function() {
    this.x += (this.initX < this.targetX) ? this.speed : -this.speed;
    this.y = (this.x * this.slope) + this.y_intercept;
    context = game_field.canvas.context;
    context.fillStyle = "#FFFF00";
    context.fillRect(this.x, this.y, this.width, this.width);
  }

}

function Obstacle(x, y, width, height, color) {

  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.color = color;
  
  this.draw = function() {
    context = game_field.canvas.context;
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
  }

}

function collidesWith(plX, plY, objX, objY, objWidth, objHeight) {
    var col_left = ((objX + objWidth) >=  plX);
    var col_right = ((plX + player.width) >= objX);
    var col_up = ((objY + objHeight) >= plY);
    var col_down = ((plY + player.width) >= objY);
    return ((plY + player.width) >= objY && plY <= (objY + objHeight) && col_left && col_right)
      || ((plX + player.width) >= objX && plX <= (objX + objWidth) && col_up && col_down);
}

function nextFrameObstacleCollision(plX, plY) {
  for(var i = 0; i < game_field.obstacles.length; i++) {
    var obs = game_field.obstacles[i];
    if(collidesWith(plX, plY, obs.x, obs.y, obs.width, obs.height)) {
      return obs;
    }
  }
  return null;
}

function updateField() {
  game_field.clear();

  if(game_field.keys && game_field.keys[37]) {
    var obs = nextFrameObstacleCollision(player.x - player.speed, player.y);
    var speed = (obs == null) ? player.speed : (player.x - (obs.x + obs.width) - 1);
    player.goLeft(speed);
  }
  if(game_field.keys && game_field.keys[39]) {
    var obs = nextFrameObstacleCollision(player.x + player.speed, player.y); 
    var speed = (obs == null) ? player.speed : (obs.x - (player.x + player.width) - 1);
    player.goRight(speed);
  }
  if(game_field.keys && game_field.keys[38]) {
    var obs = nextFrameObstacleCollision(player.x, player.y - player.speed); 
    var speed = (obs == null) ? player.speed : (player.y - (obs.y + obs.height) - 1);
    player.goUp(speed);
  }
  if(game_field.keys && game_field.keys[40]) {
    var obs = nextFrameObstacleCollision(player.x, player.y + player.speed);
    var speed = (obs == null) ? player.speed : (obs.y - (player.y + player.width) - 1);
    player.goDown(speed);
  }

  for(var i = 0; i < game_field.guns.length; i++) {
    game_field.guns[i].draw();
    game_field.guns[i].move();
    var bullet = game_field.guns[i].projectile;
    if(bullet != null && collidesWith(player.x, player.y, bullet.x, bullet.y, bullet.width, bullet.width)) {
      alert("Oh no, you've been hit! To play again please click Start.");
      game_panel.updateScore(-player.score);
      prepareRestart();
    }
  }

  exit_door.draw();
  player.draw();

  for(var i = 0; i < game_field.obstacles.length; i++) {
    var obs = game_field.obstacles[i];
    obs.draw();
  }

  if(collidesWith(player.x, player.y, exit_door.x, exit_door.y, exit_door.width, exit_door.height)) {
    alert("Congratulations! You have reached the exit with " + player.score + " points!");
    prepareRestart();
  }

}

