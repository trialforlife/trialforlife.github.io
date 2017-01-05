// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // should change dynamically
    this.x = 0;
    // this.y = 60;
    // this.y = 140;

    this.y = 220;
    this.speed = 100;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // console.log('Enemy update');
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;
    if (this.x < ctx.canvas.clientWidth) {
        this.x = this.x + this.speed * dt;
    } else {
        this.x = 0;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
var Player = function() {
    this.sprite = 'images/char-boy.png';
    //player start position
    this.x = 202;
    this.y = 380;
}
Player.prototype.render = Enemy.prototype.render;
Player.prototype.update = function(dt) {

};
Player.prototype.reset = function(){
    this.x = 202;
    this.y = 380;
};
Player.prototype.handleInput = function(direction){
    var stepUpDownLength = 84,
        stepLeftRightLenght = 100,
        iconWidth = Resources.get(this.sprite).width,
        iconHeight = Resources.get(this.sprite).height;
    switch (direction) {
        case 'left':
            // handling left border
            if (this.x - stepLeftRightLenght > 0) {
                this.x = this.x - stepLeftRightLenght; 
            }
            break;
        case 'up': 
            // handle win logic here
            if ((this.y - stepUpDownLength) > 0) {
                this.y = this.y - stepUpDownLength;   
            } else {
                // game won - reset player position
                console.info('you won');
                this.reset();
            }
            break;
        case 'right':
            if (this.x + stepLeftRightLenght + iconWidth < ctx.canvas.clientWidth) {
                this.x = this.x + stepLeftRightLenght; 
            }
            break;
        case 'down':
            if ((this.y + stepUpDownLength + iconHeight) < ctx.canvas.clientHeight) {
                this.y = this.y + stepUpDownLength;
            }
            break;
    }
};


// This class requires an update(), render() and
// a handleInput() method.


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var firstEnemy = new Enemy;
firstEnemy.y = 60;
firstEnemy.speed = 120;

var secondEnemy = new Enemy;
var allEnemies = [firstEnemy, secondEnemy];

// firstEnemy.render();

// Place the player object in a variable called player
var player = new Player;


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
