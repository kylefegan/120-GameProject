//Player prefab

//Player constructor
var Player = function(game, x, y, key, playerNumber, attackGroup, attackCollisionGroup,ballCollisionGroup, outerContext) {

	this.DEBUG_BODIES = false; //toggle for physics body debug

	// call Sprite constructor within this object
	// new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key);

	game.physics.p2.enable(this, this.DEBUG_BODIES);	// enable physics, I believe this is redundant

	//Constants
	this.MAX_LIVES = 3; //maximum number of lives
	this.PLAYER_SCALE = 1; //used to invert player sprite facing direction
	this.MAX_JUMP = 2; //how many multi jumps a player can make
	this.STRIKE_STRENGTH = 500; //how hard a player hits the ball objects
	this.JUMP_SPEED = -300; //jump strnegth
	this.PLAYER_DAMPING = 0.6; //velocity lost per second (between 1 and 0; thus percentage based)
	this.PLAYER_MASS = 6; //weight used in physics calculations

	this.ATTACK_SPAWN_OFFSET = 40; //how far in front of the sprite to spawn
	//potential issue with attack spawn offset anchor position during spawn, requires investigation.

	//variables
	this.playerDied = game.add.audio('playerDied'); //player death audio. temp asset, like everything else.
	this.jumps = this.MAX_JUMP; //tracking var for multi jumping
	this.playNum = playerNumber; //which player the instance is for
	this.playerVel = 200; //player move speed
	this.lives = this.MAX_LIVES; //current tracked lives
	this.body.damping = this.PLAYER_DAMPING;
	this.body.mass = this.PLAYER_MASS;
	this.outerContext = outerContext; //required to call functions written in 
	                                  //play state. Wasn't sure if you can or 
	                                  //how to create new functions in prefabs.

	//groups for spawning attack hitbox/hitzone
	this.attackGroup = attackGroup;
	this.attackCollisionGroup = attackCollisionGroup;
	this.ballCollisionGroup = ballCollisionGroup;

	//coloring players to differentiate them.
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

	if (this.alive) {
		// updates are wrapped within player number cases in order to handle multiple instances of player objects/sprites.
		//Player 1 stuff
		if (this.playNum == 1) {
			//movement controls
			if(game.input.keyboard.isDown(Phaser.Keyboard.A)) {

				this.body.velocity.x = -this.playerVel;
				this.scale.x = -this.PLAYER_SCALE; 	// flip sprite
				
			} else if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {

				this.body.velocity.x = this.playerVel;
				this.scale.x = this.PLAYER_SCALE; 	// re-orient sprite

			} else {
				//idles when not controlled
				//this.body.velocity.x = 0;	//this overwrites P2 physics calculations
			}

			//jump controls
			if(this.jumps > 0 && game.input.keyboard.downDuration(Phaser.Keyboard.W, 150)) {
			    this.body.velocity.y = this.JUMP_SPEED;
			    this.jumping = true;
			}

			//letting go of the UP key subtracts a jump
			if(this.jumping && game.input.keyboard.upDuration(Phaser.Keyboard.W)) {
			  	this.jumps--;
			   	this.jumping = false;
			}

			//attack stuff, spawns an invisible hit box to check collisions
			if (game.input.keyboard.justPressed(Phaser.Keyboard.SHIFT)) {
				if (this.scale.x > 0) {
					this.attackOffset = this.x + this.ATTACK_SPAWN_OFFSET;
					this.attackDirection = 1;
				} else {
					this.attackOffset = this.x -this.ATTACK_SPAWN_OFFSET;
					this.attackDirection = -1;
				}

				//PlayerAttackZone = function(game, x, y, key, strength, direction, outerContext)
				this.attackZone = new PlayerAttackZone(game, this.attackOffset, this.y, 'attackZone', this.STRIKE_STRENGTH, this.attackDirection, this.outerContext);
				this.game.add.existing(this.attackZone);
				this.attackZone.body.setCollisionGroup(this.attackCollisionGroup);
				this.attackZone.body.collides(this.ballCollisionGroup, this.outerContext.playerAttack, this.outerContext);
				this.attackGroup.add(this.attackZone);
			}

		// Player 2 stuff
		} else if (this.playNum == 2) {
			
			if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {

				this.body.velocity.x = -this.playerVel;
				this.scale.x = -this.PLAYER_SCALE; 	// flip sprite
				
			} else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {

				this.body.velocity.x = this.playerVel;
				this.scale.x = this.PLAYER_SCALE; 	// re-orient sprite

			} else {
				//this.body.velocity.x = 0; //this overwrites P2 physics calculations
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

			//attack stuff
			if (game.input.keyboard.justPressed(Phaser.Keyboard.NUMPAD_0)) {
				if (this.scale.x > 0) {
					this.attackOffset = this.x + this.ATTACK_SPAWN_OFFSET;
					this.attackDirection = 1;
				} else {
					this.attackOffset = this.x -this.ATTACK_SPAWN_OFFSET;
					this.attackDirection = -1;
				}
				this.attackZone = new PlayerAttackZone(game, this.attackOffset, this.y, 'attackZone', this.STRIKE_STRENGTH, this.attackDirection, this.outerContext);
				this.game.add.existing(this.attackZone);
				this.attackZone.body.setCollisionGroup(this.attackCollisionGroup);
				this.attackZone.body.collides(this.ballCollisionGroup, this.outerContext.playerAttack, this.outerContext);
				this.attackGroup.add(this.attackZone);
			}
		}
	}

}

