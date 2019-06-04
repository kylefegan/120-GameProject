//PlayerAttackZone prefab

//PlayerAttackZone constructor
var PlayerAttackZone = function(game, x, y, key, playNum, strength, direction, outerContext) {

	this.DEBUG_BODIES = false; //toggle for physics body debug
	
	// call Sprite constructor within this object
	// new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key);

	game.physics.p2.enable(this, this.DEBUG_BODIES);	// enable physics

	//this.body.data.gravityScale = 0; //prevents hitzone from falling due to gravity
	//this.body.setZeroVelocity();
	//this.body.static = true; //prevents movement from kinetic energy
	this.STRIKE_STRENGTH = strength; //carried over from the player prefab and used in play state function playerAttack()
	this.direction = direction; //carried over from the player prefab and used in play state function playerAttack()
	this.outerContext = outerContext; //currently unused in this file but may be needed later.
	this.lifeTime = 10; //how long the hit zone exists. measured in update cycles.
	this.playNum = playNum;
	this.lockConstraint = null; //this is set when the attack is spawned in the player prefab

};

//inherit prototype from Phaser.Sprite and set constructor to Player
//the Object.create method creates a new object w/ the specified prototype object and properties
PlayerAttackZone.prototype = Object.create(Phaser.Sprite.prototype);
//since we used Object.create, we need to explicitly set the constructor
PlayerAttackZone.prototype.constructor = Player;  

//override the Phaser.Sprite update function
PlayerAttackZone.prototype.update = function() {
	//decrement life timer
	this.lifeTime--;

	//removes itself when time is up.
	if (this.lifeTime <= 0) {
		if (this.lockConstraint != null) {
			game.physics.p2.removeConstraint(this.lockConstraint);
			this.lockConstraint = null;
		}
		this.safeDestroy = true;
		this.destroy();
	}
}

