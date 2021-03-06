//Player prefab

//Player constructor
var Player = function(game, x, y, key, playerNumber, attackGroup, attackCollisionGroup, ballCollisionGroup,  
			bubbleGroup, bubbleCollisionGroup, outerContext) {

	this.DEBUG_BODIES = false; //toggle for physics body debug

	// call Sprite constructor within this object
	// new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key);

	game.physics.p2.enable(this, this.DEBUG_BODIES);	// enable physics, I believe this is redundant

	//Constants
	this.MAX_LIVES = 3; //maximum number of lives
	this.PLAYER_SCALE = 1; //used to invert player sprite facing direction
	this.MAX_JUMP = 2; //how many multi jumps a player can make
	this.STRIKE_STRENGTH = 500; //how hard a player hits the ball objects //500
	this.JUMP_SPEED = -300; //jump strnegth
	this.PLAYER_MASS = 6; //weight used in physics calculations
	this.PLAYER_DAMPING = 0.6; //velocity lost per second (between 1 and 0; thus percentage based)
	this.BUBBLE_COOLDOWN = 200; //about 3.5 SECONDS. This is an inelegant solution.
	this.ATTACK_SPAWN_OFFSET = 30; //how far in front of the sprite to spawn
	
	//variables
	this.playerDied = game.add.audio('playerDied');                 //player death audio.
	this.playerAttacked = game.add.audio('pAttack');                //player attack audio.
	this.playerBubbled = game.add.audio('pBubble');                 //player bubble shield audio.
	this.playerBubbledCooldown = game.add.audio('pBubbleCooldown'); //player bubble on cooldown sound.
	this.jumps = this.MAX_JUMP; //tracking var for multi jumping
	this.playNum = playerNumber; //which player the instance is for
	this.playerVel = 200; //player move speed
	this.lives = this.MAX_LIVES; //current tracked lives
	this.jumping = false;
	this.bubbleCooldown = 0;
	//this.body.mass = this.PLAYER_MASS; //this doesn't work for some reason, handled in play state
	//this.body.damping = this.PLAYER_DAMPING; //this doesn't work for some reason, handled in play state
	this.outerContext = outerContext; //required to call functions written in 
	                                  //play state. Didn't know if you could, or 
	                                  //how to, create new functions in prefabs at
	                                  //the time of building the initial prefab.

	//groups and materials for player spawned sprites
	this.attackGroup = attackGroup;
	this.attackCollisionGroup = attackCollisionGroup;
	this.ballCollisionGroup = ballCollisionGroup;
	this.bubbleGroup = bubbleGroup;
	this.bubbleCollisionGroup = bubbleCollisionGroup;
	//this.bubbleMaterial = bubbleMaterial;

	//coloring players to differentiate them.
	//if (this.playNum == 1) {
	//	this.tint = 0xf4307c;
	//} else if (this.playNum == 2) {
	//	this.tint = 0x26baff;
	//}

};

//inherit prototype from Phaser.Sprite and set constructor to Player
//the Object.create method creates a new object w/ the specified prototype object and properties
Player.prototype = Object.create(Phaser.Sprite.prototype);
//since we used Object.create, we need to explicitly set the constructor
Player.prototype.constructor = Player;  

//override the Phaser.Sprite update function
Player.prototype.update = function() {
	this.bubbleCooldown--;

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

			}

			if (game.input.keyboard.justPressed(Phaser.Keyboard.S)) {
				this.body.velocity.y = 1000; //fast fall

				//used to prevent fast fall sliding
				this.outerContext.playTerrContact[1].friction = 1e7;
				
			}

			//resets friction if not fast falling
			if (this.body.velocity.y < 900) {
				this.outerContext.playTerrContact[1].friction = 1.0;
			}

			//jump controls
			if(this.jumps > 0 && game.input.keyboard.downDuration(Phaser.Keyboard.W, 150)) {
			    this.body.velocity.y = this.JUMP_SPEED;
			    this.jumping = true;
			    //console.log(this.body.velocity.y);
			}

			//letting go of the UP key subtracts a jump
			if(this.jumping && game.input.keyboard.upDuration(Phaser.Keyboard.W)) {
			  	this.jumps--;
			   	this.jumping = false;
			   	//console.log('Jumping: ' + this.jumping);
			}

			//attack stuff, spawns an invisible hit box to check collisions
			if (game.input.keyboard.justPressed(Phaser.Keyboard.C)) {
				this.playerAttacked.play();
				if (this.scale.x > 0) {
					this.attackOffset = this.x + this.ATTACK_SPAWN_OFFSET;
					this.attackDirection = 1;
					this.attackAnchor = 0;
				} else {
					this.attackOffset = this.x -this.ATTACK_SPAWN_OFFSET;
					this.attackDirection = -1;
					this.attackAnchor = 1;
				}
				
				//Player1 Attack Animation
				attackAnimation = this.game.add.sprite(this.attackOffset, this.y - 10, 'attack1', 0)
				attackAnimation.scale.x = 2 * this.scale.x;
				attackAnimation.scale.y = 2;
				attackAnimation.lifespan = 800;
				attackAnimation.animations.add('idle', [0,1,2,3,4,5,6,7,8,9], 10, false);
				attackAnimation.animations.play('idle');
					
				//PlayerAttackZone = function(game, x, y, key, playNum, strength, direction, outerContext)
				this.attackZone = new PlayerAttackZone(game, this.attackOffset, this.y, 'attackZone', this.playNum, 
					this.STRIKE_STRENGTH, this.attackDirection, this.outerContext);
				this.attackZone.anchor.x = this.attackAnchor;
				this.attackZone.anchor.y = 0.5;
				this.game.add.existing(this.attackZone);
				this.attackZone.lockConstraint = this.game.physics.p2.createLockConstraint(this.attackZone, this, 
					[this.attackDirection*this.ATTACK_SPAWN_OFFSET, 0]);
				this.attackZone.body.setCollisionGroup(this.attackCollisionGroup);
				this.attackZone.body.collides(this.ballCollisionGroup, this.outerContext.playerAttack, this.outerContext);
				this.attackGroup.add(this.attackZone);
			}

			//defense bubble
			if (game.input.keyboard.justPressed(Phaser.Keyboard.V)) {
				if (this.bubbleCooldown <= 0) {
					//PlayerBubble = function(game, x, y, key, playNum, outerContext)
					this.bubble = new PlayerBubble(game, this.x, this.y, 'playerBubble', 
						this.playNum, this.outerContext);
					this.game.add.existing(this.bubble);
					//this.bubble.anchor.set(0.5); //P2 may do this automatically.
					this.bubble.lockConstraint = this.game.physics.p2.createLockConstraint(this.bubble, this, [0,0]);
					this.bubble.body.setCollisionGroup(this.bubbleCollisionGroup);
					this.bubble.body.setMaterial(this.outerContext.bubbleMaterials[this.playNum]);
					this.bubble.body.collides([this.ballCollisionGroup]);
					this.bubbleGroup.add(this.bubble);
					this.bubbleCooldown = this.BUBBLE_COOLDOWN;
					this.playerBubbled.play();
				} else {
					this.playerBubbledCooldown.play();
				}
			}

		// Player 2 stuff
		} else if (this.playNum == 2) {
			
			//movement keys
			if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {

				this.body.velocity.x = -this.playerVel;
				this.scale.x = -this.PLAYER_SCALE; 	// flip sprite
				
			} else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {

				this.body.velocity.x = this.playerVel;
				this.scale.x = this.PLAYER_SCALE; 	// re-orient sprite

			}

			if (game.input.keyboard.justPressed(Phaser.Keyboard.DOWN)) {
				this.body.velocity.y = 1000; //fast fall

				//used to prevent fast fall sliding
				this.outerContext.playTerrContact[2].friction = 1e7;
			}

			//resets friction if not fast falling
			if (this.body.velocity.y < 900) {
				this.outerContext.playTerrContact[2].friction = 1.0;
			}

			if(this.jumps > 0 && game.input.keyboard.downDuration(Phaser.Keyboard.UP, 150)) {
			    this.body.velocity.y = this.JUMP_SPEED;
			    this.jumping = true;
			    //console.log(this.body.velocity.y);
			}
			
			//letting go of the UP key subtracts a jump
			if(this.jumping && game.input.keyboard.upDuration(Phaser.Keyboard.UP)) {
			  	this.jumps--;
			   	this.jumping = false;
			}

			//attack stuff
			if (game.input.keyboard.justPressed(Phaser.Keyboard.COMMA)) {
				this.playerAttacked.play();
				if (this.scale.x > 0) {
					this.attackOffset = this.x + this.ATTACK_SPAWN_OFFSET;
					this.attackDirection = 1;
				} else {
					this.attackOffset = this.x -this.ATTACK_SPAWN_OFFSET;
					this.attackDirection = -1;
				}
				
				//Player 2 Attack Animation
				attackAnimation = this.game.add.sprite(this.attackOffset, this.y - 10, 'attack', 0)
				attackAnimation.scale.x = 2 * this.scale.x;
				attackAnimation.scale.y = 2;
				attackAnimation.lifespan = 800;
				attackAnimation.animations.add('idle', [0,1,2,3,4,5,6,7,8,9], 10, false);
				attackAnimation.animations.play('idle');
				
				//PlayerAttackZone = function(game, x, y, key, playNum, strength, direction, outerContext)
				this.attackZone = new PlayerAttackZone(game, this.attackOffset, this.y, 'attackZone', this.playNum, 
					this.STRIKE_STRENGTH, this.attackDirection, this.outerContext);
				this.attackZone.anchor.x = this.attackAnchor;
				this.attackZone.anchor.y = 0.5;
				this.game.add.existing(this.attackZone);
				this.attackZone.lockConstraint = this.game.physics.p2.createLockConstraint(this.attackZone, this, 
					[this.attackDirection*this.ATTACK_SPAWN_OFFSET, 0]);
				this.attackZone.body.setCollisionGroup(this.attackCollisionGroup);
				this.attackZone.body.collides(this.ballCollisionGroup, this.outerContext.playerAttack, this.outerContext);
				this.attackGroup.add(this.attackZone);
			}

			//defense bubble
			if (game.input.keyboard.justPressed(Phaser.Keyboard.PERIOD)) {
				if (this.bubbleCooldown <= 0) {
					//PlayerBubble = function(game, x, y, key, playNum, outerContext)
					this.bubble = new PlayerBubble(game, this.x, this.y, 'playerBubble2', 
						this.playNum, this.outerContext);
					this.game.add.existing(this.bubble);
					//this.bubble.anchor.set(0.5); //P2 may do this automatically.
					this.bubble.lockConstraint = this.game.physics.p2.createLockConstraint(this.bubble, this, [0,0]);
					this.bubble.body.setCollisionGroup(this.bubbleCollisionGroup);
					this.bubble.body.setMaterial(this.outerContext.bubbleMaterials[this.playNum]);
					this.bubble.body.collides([this.ballCollisionGroup]);
					this.bubbleGroup.add(this.bubble);
					this.bubbleCooldown = this.BUBBLE_COOLDOWN;
					this.playerBubbled.play();
				} else {
					this.playerBubbledCooldown.play();
				}
			}
		}
	}
}

