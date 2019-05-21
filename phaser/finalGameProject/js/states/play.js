// Play state

var Play = function(game) {};
Play.prototype = {
	init: function(freshStart, playerOneLives, playerTwoLives) {
		this.justStarted = freshStart;
		this.p1Lives = playerOneLives;
		this.p2Lives = playerTwoLives;
	},

	create: function() {
		//this will toggle p2 physics debug bodies in this file. Check player and 
		// playerAttackZone prefabs for their bodies.
		this.DEBUG_BODIES = false; 

		game.stage.setBackgroundColor('#87CEEB'); //stage background color: light blue

		game.physics.startSystem(Phaser.Physics.P2JS);

		this.worldMaterial = game.physics.p2.createMaterial('worldMaterial');
		//4 trues == the 4 faces of the world in left, right, top, bottom order
		game.physics.p2.setWorldMaterial(this.worldMaterial, true, true, true, true);

		game.physics.p2.gravity.y = 500;

		//this prevents players from bumping into each other.
		game.physics.p2.setPostBroadphaseCallback(this.checkPlayerVsPlayerCollision, this);

		//collision groups
		//the attack group will be populated when the player attacks. A group is needed so it 
		//can be passed around and also checked out here.
		this.attackCollisionGroup = game.physics.p2.createCollisionGroup();
		this.playerCollisionGroup = game.physics.p2.createCollisionGroup();
		this.ballCollisionGroup = game.physics.p2.createCollisionGroup();
		this.terrainCollisionGroup = game.physics.p2.createCollisionGroup();
		this.hazardCollisionGroup = game.physics.p2.createCollisionGroup();
		game.physics.p2.updateBoundsCollisionGroup();

		//sprite groups with physics bodies
		this.terrainGroup = game.add.group();
		this.terrainGroup.enableBody = true;
		this.terrainGroup.physicsBodyType = Phaser.Physics.P2JS;

		this.hazardGroup = game.add.group();
		this.hazardGroup.enableBody = true;
		this.hazardGroup.physicsBodyType = Phaser.Physics.P2JS;

		this.attackGroup = game.add.group();
		this.attackGroup.enableBody = true;
		this.attackGroup.physicsBodyType = Phaser.Physics.P2JS;

		this.playerGroup = game.add.group();
		this.playerGroup.enableBody = true;
		this.playerGroup.physicsBodyType = Phaser.Physics.P2JS;

		this.ballGroup = game.add.group();
		this.ballGroup.enableBody = true;
		this.ballGroup.physicsBodyType = Phaser.Physics.P2JS;

		//Terrain
		//adds base terrain with custom hitbox and is static
		this.baseTerrain = this.terrainGroup.create(game.world.width/2, game.world.height/2, 'baseTerrain');
		this.game.physics.p2.enable(this.baseTerrain, this.DEBUG_BODIES);
        this.baseTerrain.body.clearShapes();
		this.baseTerrain.body.loadPolygon("physics", "PyramidLevel");
		this.baseTerrain.body.static = true;
		this.baseTerrain.body.setCollisionGroup(this.terrainCollisionGroup);
		this.baseTerrain.body.collides([this.ballCollisionGroup, this.playerCollisionGroup]);
		this.baseTerrainMaterial = game.physics.p2.createMaterial('baseTerrainMaterial', this.baseTerrain.body);

		//Hazard 1
		this.hazard = new  Hazard(this.game, (game.world.width/2)-200, game.world.height*.735, 'fire', 
			this.playerCollisionGroup, this.ballCollisionGroup, this.hazardCollisionGroup);
		//this.hazardMaterial = game.physics.p2.createMaterial('hazardMaterial', this.hazard.body);
		this.hazardMaterial = game.physics.p2.createMaterial('hazardMaterial');
		this.hazard.body.setMaterial(this.hazardMaterial);
		this.game.add.existing(this.hazard);
		this.hazardGroup.add(this.hazard);

		//Hazard 2
		this.hazard2 = new  Hazard(this.game, (game.world.width/2)+200, game.world.height*.735, 'fire', 
			this.playerCollisionGroup, this.ballCollisionGroup, this.hazardCollisionGroup);
		//this.hazard2Material = game.physics.p2.createMaterial('hazard2Material', this.hazard2.body);
		this.hazard2.body.setMaterial(this.hazardMaterial);
		this.game.add.existing(this.hazard2);
		this.hazardGroup.add(this.hazard);

		// Ball 1
		//this.ball1 = this.ballGroup.create(150, 60, 'ball');
		this.ball1 = game.add.sprite(230, 300, 'ball');
		this.ball1.tint = 0xc242f4;
		game.physics.p2.enable(this.ball1, this.DEBUG_BODIES);
		this.ball1.body.setCircle(18);
		this.ball1.body.mass = 2;
		//this.ball1Material = game.physics.p2.createMaterial('ball1Material', this.ball1.body);
		this.ballMaterial = game.physics.p2.createMaterial('ball1Material');
		this.ball1.body.setMaterial(this.ballMaterial);
		this.ball1.body.setCollisionGroup(this.ballCollisionGroup);
		this.ball1.body.collides([this.ballCollisionGroup, this.playerCollisionGroup, 
			this.attackCollisionGroup, this.terrainCollisionGroup, this.hazardCollisionGroup]);
		this.ballGroup.add(this.ball1);

		// Ball 2
		//this.ball2 = this.ballGroup.create(this.game.width - 150, 60, 'ball');
		this.ball2 = game.add.sprite(this.game.width - 230, 300, 'ball');
		this.ball2.tint = 0xf4ee41;
		game.physics.p2.enable(this.ball2, this.DEBUG_BODIES);
		this.ball2.body.setCircle(18);
		this.ball2.body.mass = 2;
		//this.ball2Material = game.physics.p2.createMaterial('ball2Material', this.ball2.body);
		this.ball2.body.setMaterial(this.ballMaterial);
		this.ball2.body.setCollisionGroup(this.ballCollisionGroup);
		this.ball2.body.collides([this.ballCollisionGroup, this.playerCollisionGroup, 
			this.attackCollisionGroup, this.terrainCollisionGroup, this.hazardCollisionGroup]);
		this.ballGroup.add(this.ball2);

		//Player 1
		//Player = function(game, x, y, key, playerNumber, attackGroup, attackCollisionGroup,
		// ballCollisionGroup, outerContext)
		this.player = new Player(this.game, this.game.width/2 - 40, this.game.height/2, 'golem', 1, 
			this.attackGroup, this.attackCollisionGroup, this.ballCollisionGroup, this);
		if (!this.justStarted) {
			this.player.lives = this.p1Lives;
		}
		this.game.add.existing(this.player);
		this.player.body.setCircle(16); //may want to make the parameter a constant in the player prefab.
		this.player.body.collideWorldBounds = true;
		this.player.body.fixedRotation = true;
		this.player.body.dynamic = true; //This may actually be unnecessary.
		this.player.body.mass = this.player.PLAYER_MASS;
		this.player.body.damping = this.player.PLAYER_DAMPING;
		//this.playerMaterial = game.physics.p2.createMaterial('playerMaterial', this.player.body);
		this.playerMaterial = game.physics.p2.createMaterial('playerMaterial');
		this.player.body.setMaterial(this.playerMaterial);
		this.player.body.setCollisionGroup(this.playerCollisionGroup);
		this.player.body.collides([this.ballCollisionGroup, this.terrainCollisionGroup, 
			this.hazardCollisionGroup]);
		this.playerGroup.add(this.player);
		this.player.animations.add('run', [0,1,2,3,4,5,6,7,8,9], 10, true);
		this.player.animations.play('run');

		//Player 2
		//Player = function(game, x, y, key, playerNumber, attackGroup, attackCollisionGroup, 
		//ballCollisionGroup, outerContext)
		this.player2 = new Player(this.game, this.game.width/2 + 40, this.game.height/2, 'golem', 2, 
			this.attackGroup, this.attackCollisionGroup, this.ballCollisionGroup, this);
		if (!this.justStarted) {
			this.player2.lives = this.p2Lives;
		}
		this.game.add.existing(this.player2);
		this.player2.body.setCircle(16);
		this.player2.body.collideWorldBounds = true;
		this.player2.body.fixedRotation = true;
		this.player2.body.dynamic = true;
		this.player2.body.mass = this.player2.PLAYER_MASS;
		this.player2.body.damping = this.player2.PLAYER_DAMPING;
		//this.player2Material = game.physics.p2.createMaterial('player2Material', this.player2.body);
		this.player2.body.setMaterial(this.playerMaterial);
		this.player2.body.setCollisionGroup(this.playerCollisionGroup);
		this.player2.body.collides([this.ballCollisionGroup, this.terrainCollisionGroup, 
			this.hazardCollisionGroup]);
		this.playerGroup.add(this.player2);
		this.player2.animations.add('run', [0,1,2,3,4,5,6,7,8,9], 10, true);
		this.player2.animations.play('run');
		
		//This place holder attackZone is only here to configure the collision mechanics and
		// is never truly used by anything else; it actually terminates itself after a few update cycles
		//PlayerAttackZone = function(game, x, y, key, strength, direction, outerContext)
		this.attackZonePlaceHolder = new PlayerAttackZone(this.game, -50, 0, 'attackZone', 0, 0, this);
		this.game.add.existing(this.attackZonePlaceHolder);
		this.attackZonePlaceHolder.body.setCollisionGroup(this.attackCollisionGroup);
		this.attackZonePlaceHolder.body.collides(this.ballCollisionGroup, this.playerAttack, this);
		this.attackGroup.add(this.attackZonePlaceHolder); //don't know if this is truly necessary.
		//NOTE: there is no material setup up here because as far as I know you have to
		// create a material for each instance of something and attack zones are repeatedly created
		// and destroyed. If a material is needed, it will have to go in the attack zone or player prefab.

		//contact material setup
		// Terrain Vs Player contact
		this.baseTerVsPlayContact = game.physics.p2.createContactMaterial(this.playerMaterial, 
			this.baseTerrainMaterial);
		// Friction to use in the contact of these two materials.
		this.baseTerVsPlayContact.friction = 1.0;
		// Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
	    this.baseTerVsPlayContact.restitution = 0.0; //mostly works. Flat surfaces: yes, angles: no
	    // Stiffness of the resulting ContactEquation that this baseTerVsPlayContact generate.
	    this.baseTerVsPlayContact.stiffness = 1e7; //causes clipping with buoyant fluid motions
	    // Relaxation of the resulting ContactEquation that this baseTerVsPlayContact generate.
	    this.baseTerVsPlayContact.relaxation = 3;
	    // Stiffness of the resulting FrictionEquation that this baseTerVsPlayContact generate.   
	    this.baseTerVsPlayContact.frictionStiffness = 1e7; 
	    // Relaxation of the resulting FrictionEquation that this baseTerVsPlayContact generate.   
	    this.baseTerVsPlayContact.frictionRelaxation = 3;
	    // Will add surface velocity to this material. If bodyA rests on top of bodyB, and the 
	    // surface velocity is positive, bodyA will slide to the right. 
	    this.baseTerVsPlayContact.surfaceVelocity = 0;

	    // Terrain Vs Ball contact
	    this.baseTerVsBallContact = game.physics.p2.createContactMaterial(this.ballMaterial, 
	    	this.baseTerrainMaterial);
		this.baseTerVsBallContact.friction = 1.0;
	    this.baseTerVsBallContact.restitution = 0.5;
	    this.baseTerVsBallContact.stiffness = 1e7;
	    this.baseTerVsBallContact.relaxation = 3;  
	    this.baseTerVsBallContact.frictionStiffness = 1e7;   
	    this.baseTerVsBallContact.frictionRelaxation = 3;
	    this.baseTerVsBallContact.surfaceVelocity = 0;

	    // Hazard Vs Ball contact, same as terrain vs ball.
	    this.hazardVsBallContact = game.physics.p2.createContactMaterial(this.ballMaterial, 
	    	this.hazardMaterial);
		this.hazardVsBallContact.friction = 1.0;
	    this.hazardVsBallContact.restitution = 0.5;
	    this.hazardVsBallContact.stiffness = 1e7;
	    this.hazardVsBallContact.relaxation = 3;  
	    this.hazardVsBallContact.frictionStiffness = 1e7;   
	    this.hazardVsBallContact.frictionRelaxation = 3;
	    this.hazardVsBallContact.surfaceVelocity = 0;

		// create callback event if player hits baseTerrain
		game.physics.p2.setImpactEvents(true);
		this.player.body.createBodyCallback(this.baseTerrain, this.jumpReset);
		this.player2.body.createBodyCallback(this.baseTerrain, this.jumpReset);

		//create callback for ball or hazards with players to kill players when hit
		this.player.body.createGroupCallback(this.ballCollisionGroup, this.hitByBall);
		this.player2.body.createGroupCallback(this.ballCollisionGroup, this.hitByBall);
		this.player.body.createGroupCallback(this.hazardCollisionGroup, this.hitByHazard);
		this.player2.body.createGroupCallback(this.hazardCollisionGroup, this.hitByHazard);

		for(var i = 0; i < this.player.lives; i++) {
			var healthbar = game.add.sprite((game.world.width/2)-(i*64)-64,32, 'heart');
		}
		for(var j = 0; j < this.player2.lives; j++) {
			var healthbar2 = game.add.sprite((game.world.width/2)+(j*64),32, 'heart2');
		}

		var playText = game.add.text(game.width/2, 16, 
			'P1                                             P2', 
			{font: 'Helvetica', fontSize: '24px', fill: '#fff'});
		playText.anchor.set(0.5);
	},
	
	update: function() {
		//Check prefab update functions for more information on updates.
    	if(game.input.keyboard.isDown(Phaser.Keyboard.R)) {
    		game.state.start('GameOver', true, false, this.player.lives, this.player2.lives);
    	}
	},
	
	// Player jump count resets on collision with "baseTerrain."
	// This also means players can effectively wall jump. May need to address this later.
	jumpReset: function(thisBody, impactedBody) {
		thisBody.sprite.jumps = thisBody.sprite.MAX_JUMP;
	},

	//this will need to change when new assets come in.
	checkPlayerVsPlayerCollision: function(body1, body2) {
		if ((body1.sprite === this.player && body2.sprite === this.player2) || 
			(body2.sprite === this.player && body1.sprite === this.player2)) {
			return false;
		}
		return true;
	},

	//player attack handling
	//this knocks the balls back when a player strikes them
	playerAttack: function(body1, body2) {
		body2.sprite.body.velocity.x = body1.sprite.STRIKE_STRENGTH * body1.sprite.direction;
		body1.safeDestroy = true;
	},

	hitByBall: function(receiver, hitter) {
		//checks ball velocity, if moving >= a percentage of strike strength, kill player.
		this.strikeThreshold = 0.3; //30%

		//console.log('PlayerVel: ' + receiver.sprite.body.velocity.x);
		//console.log('ballVel: ' + hitter.sprite.body.velocity.x);

		if (hitter.sprite.body.velocity.x < 0) {
			if (hitter.sprite.body.velocity.x <= (receiver.sprite.STRIKE_STRENGTH * this.strikeThreshold * -1)) {
				receiver.sprite.playerDied.play(); //death audio
				//receiver.sprite.destroy(); //using destroy to prevent players spawning attack zones while
				                             // dead. May create custom handling later so that .kill() can 
				                             //be used.
				receiver.sprite.kill();
				receiver.sprite.lives--;
				console.log('Player ' + receiver.sprite.playNum + ': ' + 
					receiver.sprite.lives + ' lives remaining.');

				if(receiver.sprite.outerContext.player.lives == 0 || 
					receiver.sprite.outerContext.player2.lives == 0) {
				game.state.start('GameOver', true, false, receiver.sprite.outerContext.player.lives, 
					receiver.sprite.outerContext.player2.lives);
				}
				var scoreText = game.add.text(game.width/2, game.height/2, 'P1: ' + 
					receiver.sprite.outerContext.player.lives + '  P2: ' + 
					receiver.sprite.outerContext.player2.lives, {font: 'Helvetica', 
					fontSize: '48px', fill: '#fff'});
				scoreText.anchor.set(0.5);
				game.time.events.add(Phaser.Timer.SECOND * 2, function() { game.state.start('Play', 
					true, false, false, receiver.sprite.outerContext.player.lives, 
					receiver.sprite.outerContext.player2.lives)});
			}

		} else {
			if (hitter.sprite.body.velocity.x >= (receiver.sprite.STRIKE_STRENGTH * this.strikeThreshold)) {
				receiver.sprite.playerDied.play(); //death audio
				//receiver.sprite.destroy(); //using destroy to prevent players spawning attack zones while dead.
				receiver.sprite.kill();
				receiver.sprite.lives--;
				console.log('Player ' + receiver.sprite.playNum + ': ' + 
					receiver.sprite.lives + ' lives remaining.');

				if(receiver.sprite.outerContext.player.lives == 0 || 
					receiver.sprite.outerContext.player2.lives == 0) {
				game.state.start('GameOver', true, false, receiver.sprite.outerContext.player.lives, 
					receiver.sprite.outerContext.player2.lives);
				}
				var scoreText = game.add.text(game.width/2, game.height/2, 'P1: ' + 
					receiver.sprite.outerContext.player.lives + '  P2: ' + 
					receiver.sprite.outerContext.player2.lives, {font: 'Helvetica', fontSize: '48px', 
					fill: '#fff'});
				scoreText.anchor.set(0.5);
				game.time.events.add(Phaser.Timer.SECOND * 2, function() { game.state.start('Play', 
					true, false, false, receiver.sprite.outerContext.player.lives, 
					receiver.sprite.outerContext.player2.lives)});
			}
		}
	},

	hitByHazard: function(receiver, hitter) {
		receiver.sprite.playerDied.play(); //death audio
		receiver.sprite.kill();
		//receiver.sprite.destroy();//using destroy to prevent players spawning attack zones while dead.
		receiver.sprite.lives--;
		console.log('Player ' + receiver.sprite.playNum + ': ' + receiver.sprite.lives + ' lives remaining.');

		if(receiver.sprite.outerContext.player.lives == 0 || receiver.sprite.outerContext.player2.lives == 0) {
				game.state.start('GameOver', true, false, receiver.sprite.outerContext.player.lives, 
					receiver.sprite.outerContext.player2.lives);
		}
		var scoreText = game.add.text(game.width/2, game.height/2, 'P1: ' + 
			receiver.sprite.outerContext.player.lives + '  P2: ' + 
			receiver.sprite.outerContext.player2.lives, {font: 'Helvetica', fontSize: '48px', fill: '#fff'});
		scoreText.anchor.set(0.5);
		game.time.events.add(Phaser.Timer.SECOND * 2, function() { game.state.start('Play', 
			true, false, false, receiver.sprite.outerContext.player.lives, 
			receiver.sprite.outerContext.player2.lives)});
	},

	

};