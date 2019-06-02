//Breakable prefab

//Breakable constructor
var Breakable = function(game, x, y, key, outerContext) {

	this.DEBUG_BODIES = false; //toggle for physics body debug
	
	// call Sprite constructor within this object
	// new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key);

	game.physics.p2.enable(this, this.DEBUG_BODIES);	// enable physics

	this.xPos = x;
	this.yPos = y;
	this.tint = 0xf4307c;
	this.unbroken = true;

};

//inherit prototype from Phaser.Sprite and set constructor to Breakable
//the Object.create method creates a new object w/ the specified prototype object and properties
Breakable.prototype = Object.create(Phaser.Sprite.prototype);
//since we used Object.create, we need to explicitly set the constructor
Breakable.prototype.constructor = Breakable;  

//override the Phaser.Sprite update function
Breakable.prototype.update = function() {
	if (this.unbroken) {
		this.reset(this.xPos, this.yPos, this.health);
		this.body.fixedRotation = true;
	}
}
