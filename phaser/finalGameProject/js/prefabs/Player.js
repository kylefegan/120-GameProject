//Player prefab

//Player constructor
var Player = function(game, x, y, key, playerNumber) {
	// call Sprite constructor within this object
	// new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key);
	game.physics.p2.enable(this, false);	// enable physics

	this.PLAYER_SCALE = 1;
	this.MAX_JUMP = 2;
	this.jumps = this.MAX_JUMP;
	this.JUMP_SPEED = -300;
	this.canJump = false;
	this.playNum = playerNumber;
	this.playerVel = 200;

	if (this.playNum == 1) {
		this.tint = 0xf4307c;
	} else if (this.playNum == 2) {
		this.tint = 0x26baff;
	}

};

//inherit prototype from Phaser.Sprite and set constructor to Player
//the Object.create method creates a new object w/ the specified prototype object and properties
Player.prototype = Object.create(Phaser.Sprite.prototype);
//since we used Object.create, we need to explicitly set the constructor
Player.prototype.constructor = Player;  

//override the Phaser.Sprite update function
Player.prototype.update = function() {

	// updates are wrapped within player number cases
	if (this.playNum == 1) {

		if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {

			this.body.velocity.x = -this.playerVel;
			this.scale.x = -this.PLAYER_SCALE; 	// flip sprite
			
		} else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {

			this.body.velocity.x = this.playerVel;
			this.scale.x = this.PLAYER_SCALE; 	// re-orient sprite

		} else {
			this.body.velocity.x = 0;	
		}

		if(this.jumps > 0 && game.input.keyboard.downDuration(Phaser.Keyboard.UP, 150)) {
		    this.body.velocity.y = this.JUMP_SPEED;
		    this.jumping = true;
		}

		//letting go of the UP key subtracts a jump
		if(this.jumping && game.input.keyboard.upDuration(Phaser.Keyboard.UP)) {
		  	this.jumps--;
		   	this.jumping = false;
		}

	} else if (this.playNum == 2) {
		
		if(game.input.keyboard.isDown(Phaser.Keyboard.A)) {

			this.body.velocity.x = -this.playerVel;
			this.scale.x = -this.PLAYER_SCALE; 	// flip sprite
			
		} else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {

			this.body.velocity.x = this.playerVel;
			this.scale.x = this.PLAYER_SCALE; 	// re-orient sprite

		} else {
			this.body.velocity.x = 0;
		}

		if(this.jumps > 0 && game.input.keyboard.downDuration(Phaser.Keyboard.W, 150)) {
		    this.body.velocity.y = this.JUMP_SPEED;
		    this.jumping = true;
		}

		//letting go of the UP key subtracts a jump
		if(this.jumping && game.input.keyboard.upDuration(Phaser.Keyboard.W)) {
		  	this.jumps--;
		   	this.jumping = false;
		}
	}

}

