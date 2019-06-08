//Projectile prefab

//Projectile constructor
var Projectile = function(game, x, y, key, breakable, proNum, outerContext) {

	this.DEBUG_BODIES = false; //toggle for physics body debug
	
	// call Sprite constructor within this object
	// new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key);

	game.physics.p2.enable(this, this.DEBUG_BODIES);	// enable physics

	this.OBJECT_MASS = 1; //mass of projectile objects
	this.VEL_CHECK = 5; //velocity check for cancelling lethality
	this.BOUNCE_THRESHOLD_MAX = 10; //used to prevent object clipping/slipping through platforms
	this.BOUNCE_THRESHOLD_MIN = -4; //used to prevent object clipping/slipping through platforms

	this.xPos = x;
	this.yPos = y;
	this.isBreakable = breakable;
	this.outerContext = outerContext;
	this.unbroken = true;
	this.proNum = proNum;
	this.body.mass = this.OBJECT_MASS;
	this.isLethal = false; //toggle used to check if a player should die on collision,
						   //check play state's playerAttack for details on triggers

	if (this.isBreakable) {
		this.tint = 0x0077ff; //for testing clarity only
	}

	//#ff0000 red
	//#0077ff blue
	//0xFFFFFF white, will remove tint
};

//inherit prototype from Phaser.Sprite and set constructor to Projectile
//the Object.create method creates a new object w/ the specified prototype object and properties
Projectile.prototype = Object.create(Phaser.Sprite.prototype);
//since we used Object.create, we need to explicitly set the constructor
Projectile.prototype.constructor = Projectile;  

//override the Phaser.Sprite update function
Projectile.prototype.update = function() {

	//if unbroken don't move when not attacked
	if (this.isBreakable && this.unbroken) {
		this.reset(this.xPos, this.yPos, this.health);
		this.body.fixedRotation = true;
	}

	//if the projectile is either not a breakable or is already broken
	//then set it to not lethal if it is moving slow enough.
	//also colors projectile depending on lethality state.
	if (!this.isBreakable || (this.isBreakable && !this.unbroken)) {

		var vel = Math.sqrt(Math.abs((this.body.velocity.x)^2 + (this.body.velocity.y)^2));

		if (vel < this.VEL_CHECK) {
			this.isLethal = false;
		}

		if (this.isLethal) {
			this.tint = 0xff0000; //red
		} else {
			this.tint = 0xFFFFFF; //white, removes tint
		}
	}

	//checks y velocity to prevent sinking into floating platforms.
	if (this.body.velocity.y < this.BOUNCE_THRESHOLD_MAX && this.body.velocity.y > this.BOUNCE_THRESHOLD_MIN) {
		//console.log(this.proNum + ': y velocity: ' + this.body.velocity.y);
		this.outerContext.proPlatContact[this.proNum].restitution = 0;
	} else {
		this.outerContext.proPlatContact[this.proNum].restitution = 0.5;
	}

}
