//Player prefab

//Player constructor
var PlayerAttackZone = function(game, x, y, key, strength, direction, outerContext) {

	this.DEBUG_BODIES = false; //toggle for physics body debug
	
	// call Sprite constructor within this object
	// new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key);
	game.physics.p2.enable(this, this.DEBUG_BODIES);	// enable physics
	this.body.data.gravityScale = 0;
	this.body.setZeroVelocity();
	this.body.static = true;
	this.STRIKE_STRENGTH = strength;
	this.direction = direction;
	this.outerContext = outerContext;
	this.lifeTime = 10;

};

//inherit prototype from Phaser.Sprite and set constructor to Player
//the Object.create method creates a new object w/ the specified prototype object and properties
PlayerAttackZone.prototype = Object.create(Phaser.Sprite.prototype);
//since we used Object.create, we need to explicitly set the constructor
PlayerAttackZone.prototype.constructor = Player;  

//override the Phaser.Sprite update function
PlayerAttackZone.prototype.update = function() {
	this.lifeTime--;
	if (this.lifeTime <= 0) {
		this.safeDestroy = true;
		this.destroy();
	}
}

