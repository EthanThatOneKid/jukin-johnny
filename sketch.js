const width = 800;
const height = 500;
var screenX, screenY;
var pSpd = 2;
var enemySize = 50;
var uploadScore = true;
var playNow = false;
var pauseRN = false;

var files = ["dragons/dragon.gif", "dragons/dragon2.gif", "dragons/field.gif", "dragons/johnny.png"];

var loading = true;
var counter = 0;

function loadFiles(index, filename) {
    loadImage(filename, fileLoaded);
    function fileLoaded(file) {
        console.log(filename);
        files[index] = file;
        counter++;
        if (counter === files.length) {
            loading = false;
        }
    }
}

var scoreData;

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function setup() {
    var cnv = createCanvas(800, 500);
    var x = (windowWidth - width) * 0.5 + 0;
    var y = (windowHeight - height) * 0.5 + 50;
    cnv.position(x, y);

    for (var i = 0; i < files.length; i++) {
        loadFiles(i, files[i]);
    }

    console.log("Hello, this is Ethan, the creator of this game and website. Good day!");
}

var keys = [];

var keyPressed = function() {
	keys[keyCode]=true;
};

var keyReleased = function() {
	keys[keyCode]=false;
};

var d, d1, d2, field;
function preload() {
    d1 = loadImage("dragons/dragon.gif");
    d2 = loadImage("dragons/dragon2.gif");
    field = loadImage("dragons/field.gif");
    j = loadImage("dragons/johnny.png");
}

var player = function() {
    this.x = Math.random(width * 0.5);
    this.y = Math.random(height * 0.5);
    this.z = 50;
    this.spd = pSpd;

    this.update = function() {
        rectMode(CENTER);
        if (keyIsPressed && keys[UP_ARROW] || keyCode === 87) {
            this.y -= this.spd;
        }
        if (keyIsPressed && keys[DOWN_ARROW] || keyCode === 83) {
            this.y += this.spd;
        }
        if (keyIsPressed && keys[LEFT_ARROW] || keyCode === 65) {
            this.x -= this.spd;
        }
        if (keyIsPressed && keys[RIGHT_ARROW] || keyCode === 68) {
            this.x += this.spd;
        }

        if (this.y > height - this.z) {
            this.y = height - this.z;
        }
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.x > width - this.z) {
            this.x = width - this.z;
        }
        if (this.x < 0) {
            this.x = 0;
        }

        //fill(255, 0, 0);
        //rect(this.x, this.y, this.z, this.z);
        image(j, this.x, this.y, this.z, this.z);
        return [this.x, this.y, this.z];

    }
    ;
};

var Ball = function() {
    this.x = width;
    this.y = height;
    this.vx = Math.random(10);
    this.vy = Math.random(10);
    this.pet;

    this.g = 0;
    this.gSpd = 0.001;

    this.player = new player();

    this.click = function() {
        this.vx = -(this.x - this.player.update()[0]) / 30;
        this.vy = -(this.y - this.player.update()[1]) / 30;
        /*
            line(
                this.x, this.y, 
                this.player.update()[0], this.player.update()[1]
            );
*/
    }
    ;
    // On mouseclick

    this.update = function() {

        // Update positioning
        this.x += this.vx;
        this.y += this.vy;
        enemySize += 0.05;

        /*
        if(this.y <= 350) {
            this.y += this.g;
            this.g += this.gSpd;
        }
        */
        // Gravity

        /*
        if (this.x > width || this.x < 0) {this.vx*=-1;}
        if (this.y > height || this.y < 0) {this.vy*=-1;}
        */
        // Detect wall collision

        // Overall slowdown
        if (abs(this.vy) > 0 || abs(this.vx) > 0) {
            // in order to eventually = velocity of zero...
            if (this.vy > 0) {
                this.vy -= 0.05;
            }
            if (this.vy < 0) {
                this.vy += 0.05;
            }
            if (this.vx > 0) {
                this.vx -= 0.05;
            }
            if (this.vx < 0) {
                this.vx += 0.05;
            }
        }

        this.player.update();

        screenX = this.player.update()[0];
        screenY = this.player.update()[1];
        push();
        translate(-width * 0.5, -height * 0.5);
        image(field, screenX * 0.5, screenY * 0.5, width * 1.5, height * 1.5);
        pop();

        // Draw pet
        if (this.x > this.player.update()[0]) {
            d = d1;
        } else {
            d = d2;
        }
        image(d, Math.abs(this.x), Math.abs(this.y), enemySize, enemySize);
        fill(0);
        text("Lv" + Math.round(enemySize / 10), Math.abs(this.x), Math.abs(this.y));

        return [this.x, this.y, enemySize];
    }
    ;
    // update each frame

    this.check = function() {
        var dx = this.x;
        var dy = this.y;
        var dz = enemySize;
        var px = this.player.update()[0];
        var py = this.player.update()[1];
        var pz = this.player.update()[2];

        if ((dy < py && dx < px && dx + dz > px && dy + dz > py) || (dy < py + pz && dx < px + pz && dx + dz > px + pz && dy + dz > py + pz)) {
            return true;
        } else {
            return false;
        }
    }
    ;

    this.Stuck = function() {
        this.wX = Math.random(width);
        this.wY = Math.random(height);
        this.wW = Math.random(10, 50);
        this.wH = Math.random(10, 50);

        this.update = function() {
            fill(0, 255, 0);
            rect(this.wX, this.wY, this.wW, this.wH);
            /*
		if (this.player.update()[0] < this.wX && 
		    this.player.update()[0] + this.player.update()[2] > this.wX &&
		    this.player.update()[1] < this.wY && 
		    this.player.update()[1] + this.player.update()[2] > this.wY) {
			return true;
		} else {
		return false;
		}
*/
        }
        ;
    }
    ;

};

var pause = function() {
    if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
        if (pauseRN === true) {
            pauseRN = false;
        }
        if (pauseRN === false) {
            pauseRN = true;
        }
	fill(51, 51, 51, 10);
	rect(0,0,width*2,height*2);
        fill(255);
        text("PAUSED", 350, 250);
        return pauseRN;
    }
};

var pnts = 0;
var points = function() {
    if (pnts < 0) {pnts = 0;}
    pnts += 1;
    return pnts;
};

var restart = function() {
    pnts = 0;
    killed = false;
};

var kill = function() {
    var points = pnts;
	/*
    var insert;
    var yoff = 90;
    if (uploadScore === true) {
        if (window.confirm("LOL get rekt. Your score was " + points + ". Would you like to play again, scrub?")) {
            window.open("http://ethandavidson.com/johnny/", "_self");
        }
        uploadScore = false;
    }
	*/
    background(255, 0, 0, 10);
    fill(0);
    textAlign(CENTER);
    textSize(70);
    text("ya ded, foo", width * 0.5, height * 0.5 - 50);
    text("SCORE: " + points, width * 0.5, height * 0.5 + 50);

};

var rainbow = function(spd) {
    var m = 255;
    var per;
    if (spd === true) {
        per = 0.01 * spd;
    } else {
        per = 0.001;
    }
    var rainbow = color((m * 0.5 * sin(millis() * per) + (m * 0.5)), (m * 0.5 * sin(millis() * per + m) + (m * 0.5)), (m * 0.5 * sin(millis() * per + (m * 0.5)) + (m * 0.5)));
    // This method uses sine waves to make the RGBs go up and down between 0 and 255
    return rainbow;
    // return a color value
};

var wait = function() {
    fill(255); rect(width*0.42, height*0.34, 100, 10);
    background(rainbow()); 
    textSize(width * 0.04);
text("click", width * 0.46, height * 0.12);
textSize(width * 0.1);
text("Jukin' Johnny", width * 0.21, height * 0.27);
textSize(width * 0.05);
text("to begin", width * 0.43, height * 0.39);
textSize(13);
    image(j, width * 0.38, height * 0.5, 200, 200);

    if (mouseIsPressed && mouseX > width * 0.38 && mouseX < width * 0.38 + 200 && mouseY > height * 0.5 && mouseY < height * 0.5 + 200) {
        playNow = true;
    }
};

// Global Balls
var balls = [];
var amt = 1;
var killed = false;

var webs = [];
var webID = 0;
var webRN;
webs[0] = new Ball().Stuck();

for (var i = 0; i < amt; i++) {
    balls[i] = new Ball();
}

var draw = function() {
    if (loading) {
        background(0, 255, 0);
        text("LOADING", width * 0.4, height * 0.5);
    } else {
        if (!playNow) {
            wait();
        } else {
            if (killed === true) {
                kill();
            } else {
                if (!pause()) {
                    for (var i = 0; i < amt; i++) {
                        if (balls[i].check() === true) {
                            killed = true;
                        }
                        if (!isMobile()) {
                            balls[i].update();
                            balls[i].click();
                            points();
                            fill(255);
                            rect(0, height - 10, 280, 31);
                            fill(0);
                            text("points: " + pnts, 10, height - 10);
                            text("fps: " + floor(frameRate()), 100, height - 10);
			    pSpd = 2;
                        }
                    }
                } else {
                    pause();
		    var button1 = document.getElementById("decreaseF");
		    if (pnts > 400 && enemySize > 50) {
			button1.onclick = function() {
				pnts -= 400;
				enemySize -= 30;
				if (enemySize < 30) {enemySize = 30;}
			}
		    }
		    
                }

            }
        }
    }
};
