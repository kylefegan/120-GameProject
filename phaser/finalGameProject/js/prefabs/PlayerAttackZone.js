//Player prefab

//Player constructor
var PlayerAttackZone = function(game, x, y, key, strength, direction, outerContext) {
	// call Sprite constructor within this object
	// new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key);
	game.physics.p2.enable(this, false);	// enable physics
	this.STRIKE_STRENGTH = strength;
	this.direction = direction;
	this.outerContext = outerContext;
	this.lifeTime = 100;

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

