//PlayerBubble prefab

//PlayerBubble constructor
var PlayerBubble = function(game, x, y, key, playNum, outerContext) {

	this.DEBUG_BODIES = false; //toggle for physics body debug
	
	// call Sprite constructor within this object
	// new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key);

	game.physics.p2.enable(this, this.DEBUG_BODIES);	// enable physics

	this.playNum = playNum;
	this.scale.x = 2;
	this.scale.y = 2;
	this.body.setCircle(40);
	this.lockConstraint = null; //this is set when a bubble is spawned in the player prefab
	this.outerContext = outerContext; //currently unused in this file but may be needed later.
	this.lifeTime = 10; //how long the hit zone exists. measured in update cycles.


};

//inherit prototype from Phaser.Sprite and set constructor to Player
//the Object.create method creates a new object w/ the specified prototype object and properties
PlayerBubble.prototype = Object.create(Phaser.Sprite.prototype);
//since we used Object.create, we need to explicitly set the constructor
PlayerBubble.prototype.constructor = Player;  

//override the Phaser.Sprite update function
PlayerBubble.prototype.update = function() {
	//decrement life timer
	this.lifeTime--;

	//removes itself when time is up.
	if (this.lifeTime <= 0) {
		if (this.lockConstraint != null) {
			game.physics.p2.removeConstraint(this.lockConstraint);
			this.lockConstraint = null;
		}
		this.safeDestroy = true;
		//console.log('about to destroy');
		this.destroy();
	}
}
