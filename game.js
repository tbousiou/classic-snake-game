// Global variables
var s;					// snake object
var scl = 20;		// scale or grid size
var food;				// food object

var	directions = {
		UP: 0,
		RIGHT: 1,
		DOWN: 2,
		LEFT: 3	
};


function preload() {
	backgroundSound = loadSound('assets/Fantasy_Game_Background_Looping.mp3');
  foodSound = loadSound('assets/Jump-SoundBible.com-1007297584.mp3');
}

// Setup function for p5.js
function setup() {
  createCanvas(600, 600);
	s = new Snake();
	frameRate(10);
	pickLocation();
	//foodSound.setVolume(0.1);
  backgroundSound.loop();
  
}

// Draw function for p5.js
function draw() {
	// Clear background  
	background(51);
	
	// pick new location for food if it gets eaten	
	if (s.eat(food)) {
		foodSound.play();
		pickLocation();
	}	

	s.death();	
	s.update();
	s.show();
	
	
	// Draw the food
	fill(255, 0, 100);
	rect(food.x, food.y, scl, scl);
}


// Generates the coordinates for the food object
function pickLocation() {
	var cols = floor(width/scl);
	var rows = floor(height/scl);
	food = createVector(floor(random(cols)), floor(random(rows)));
	food.mult(scl);
}


// Arrow keys control
function keyPressed() {
  if ((keyCode === UP_ARROW) && (s.current_direction !== directions.DOWN)) {
    s.setDirection(directions.UP);
  } else if ((keyCode === DOWN_ARROW) && (s.current_direction !== directions.UP)) {
    s.setDirection(directions.DOWN);
	}
  else if ((keyCode === LEFT_ARROW) && (s.current_direction !== directions.RIGHT)) {
    s.setDirection(directions.LEFT);
	}
  else if ((keyCode === RIGHT_ARROW) && (s.current_direction !== directions.LEFT)) {
    s.setDirection(directions.RIGHT);
	}
}


// Snake object definition
function Snake() {
	this.x = 0;
	this.y = 0;
	this.current_direction = directions.RIGHT;
	this.xspeed = 1;
	this.yspeed = 0;
	this.total = 0;
	this.tail = [];

	this.eat = function(pos) {
		var d = dist(this.x, this.y, pos.x, pos.y);
		if (d < 1) {
			this.total++;
			return true;
		}	else {
			return false;
		}
	}  

	this.setDirection = function(dir) {
		switch(dir) {
			case directions.UP:
				this.xspeed = 0;
				this.yspeed = -1;
				this.current_direction = directions.UP;
				break;
			case directions.RIGHT:
				this.xspeed = 1;
				this.yspeed = 0;
				this.current_direction = directions.RIGHT;
				break;
			case directions.DOWN:
				this.xspeed = 0;
				this.yspeed = 1;
				this.current_direction = directions.DOWN;
				break;
			case directions.LEFT:
				this.xspeed = -1;
				this.yspeed = 0;
				this.current_direction = directions.LEFT;
				break;
			default:
				this.xspeed = 0;
				this.yspeed = 0;
		}		

	}	


	this.death = function() {
		for (var i = 0; i < this.tail.length; i++) {
			var pos = this.tail[i];
			var d = dist(this.x, this.y, pos.x, pos.y);
			if (d < 1) {
					console.log('start over');
					this.total = 0;
					this.tail = [];		
			}	
		}
	}  
  
	this.update = function() {

		// if no food eaten shift down tail array		
		if (this.total === this.tail.length) {
			for (var i = 0; i < this.tail.length-1; i++) {
				this.tail[i] = this.tail[i+1];
			}
		}	
		
		// add new spot		
		this.tail[this.total-1] = createVector(this.x, this.y);	


		this.x = this.x + this.xspeed * scl;
		this.y = this.y + this.yspeed * scl;
		
		this.x = constrain(this.x, 0, width-scl);
		this.y = constrain(this.y, 0, height-scl);


	}

	this.show = function() {
		fill(255);
		for (var i = 0; i < this.tail.length; i++) {
				rect(this.tail[i].x, this.tail[i].y, scl, scl);
		}	
		rect(this.x, this.y, scl, scl);
	}
}
