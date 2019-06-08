//Hazard prefab

//Player constructor
var Hazard = function(game, x, y, key, playerCollisionGroup, ballCollisionGroup, hazardCollisionGroup) {

	this.DEBUG_BODIES = false; //toggle for physics body debug

	// call Sprite constructor within this object
	// new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key);

	game.physics.p2.enable(this, this.DEBUG_BODIES);	// enable physics, I believe this is redundant


	//groups for spawning attack hitbox/hitzone
	this.playerCollisionGroup = playerCollisionGroup;
	this.ballCollisionGroup = ballCollisionGroup;
	this.hazardCollisionGroup = hazardCollisionGroup;

	this.body.setRectangle(96,20);
	this.body.static = true;
	this.body.setCollisionGroup(hazardCollisionGroup);
	this.body.collides([ballCollisionGroup, playerCollisionGroup]);


};

//inherit prototype from Phaser.Sprite and set constructor to Player
//the Object.create method creates a new object w/ the specified prototype object and properties
Hazard.prototype = Object.create(Phaser.Sprite.prototype);
//since we used Object.create, we need to explicitly set the constructor
Hazard.prototype.constructor = Hazard;  

//override the Phaser.Sprite update function
Hazard.prototype.update = function() {

}

