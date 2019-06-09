// Play state
// An extremely overstuffed play state...
// Would have liked to refactor everything but
// given our short-handedness, there just isn't
// time. Apologies.

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

		//this allows us to set specific conditions for valid collisions.
		game.physics.p2.setPostBroadphaseCallback(this.checkCollision, this);

		//collision groups
		//the attack group will be populated when the player attacks. A group is needed so it 
		//can be passed around and also checked out here.
		this.attackCollisionGroup = game.physics.p2.createCollisionGroup();
		this.playerCollisionGroup = game.physics.p2.createCollisionGroup();
		this.ballCollisionGroup = game.physics.p2.createCollisionGroup();
		this.terrainCollisionGroup = game.physics.p2.createCollisionGroup();
		this.hazardCollisionGroup = game.physics.p2.createCollisionGroup();
		this.bubbleCollisionGroup = game.physics.p2.createCollisionGroup();
		this.platformCollisionGroup = game.physics.p2.createCollisionGroup();
		//this.breakableCollisionGroup = game.physics.p2.createCollisionGroup();
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

		this.bubbleGroup = game.add.group();
		this.bubbleGroup.enableBody = true;
		this.bubbleGroup.phsyicsBodyType = Phaser.Physics.P2JS;

		this.breakableGroup = game.add.group();
		this.breakableGroup.enableBody = true;
		this.breakableGroup.phsyicsBodyType = Phaser.Physics.P2JS;
		
		//Skybox
		//Parallax Group #1
			//Parallax Group #2
		this.cloud1 = new  Cloud(this.game, 0, 0, 'cloud1', .6);
		this.game.add.existing(this.cloud1);
		this.cloud1.sendToBack();
			this.pcloud1 = new  Cloud(this.game, -1000, 0, 'cloud1', .6);
			this.game.add.existing(this.pcloud1);
			this.pcloud1.sendToBack();
		this.cloud2 = new  Cloud(this.game, 0, 0, 'cloud2', .5);
		this.game.add.existing(this.cloud2);
		this.cloud2.sendToBack();
			this.pcloud2 = new  Cloud(this.game, -1000, 0, 'cloud2', .5);
			this.game.add.existing(this.pcloud2);
			this.pcloud2.sendToBack();
		this.cloud3 = new  Cloud(this.game, 0, 0, 'cloud3', .4);
		this.game.add.existing(this.cloud3);
		this.cloud3.sendToBack();
			this.pcloud3 = new  Cloud(this.game, -1000, 0, 'cloud3', .4);
			this.game.add.existing(this.pcloud3);
			this.pcloud3.sendToBack();
		this.cloud4 = new  Cloud(this.game, 0, 0, 'cloud4', .3);
		this.game.add.existing(this.cloud4);
		this.cloud4.sendToBack();
			this.pcloud4 = new  Cloud(this.game, -1000, 0, 'cloud4', .3);
			this.game.add.existing(this.pcloud4);
			this.pcloud4.sendToBack();
		this.cloud5 = new  Cloud(this.game, 0, 0, 'cloud5', .2);
		this.game.add.existing(this.cloud5);
		this.cloud5.sendToBack();
			this.pcloud5 = new  Cloud(this.game, -1000, 0, 'cloud5', .2);
			this.game.add.existing(this.pcloud5);
			this.pcloud5.sendToBack();
		this.cloud6 = new  Cloud(this.game, 0, 0, 'cloud6', .1);
		this.game.add.existing(this.cloud6);
		this.cloud6.sendToBack();
			this.pcloud6 = new  Cloud(this.game, -1000, 0, 'cloud6', .1);
			this.game.add.existing(this.pcloud6);
			this.pcloud6.sendToBack();

		//---------------------
		// Material containers.
		// Ran into problems with P2 when trying to break up materials
		// across our prefabs so more stuff is handled here than should
		// really be.
		//---------------------
		this.playerMaterials = new Array();
		this.projectileMaterials = new Array();
		this.bubbleMaterials = new Array();
		this.playTerrContact = new Array(); //Player/Terrain contact
		this.playPlatContact = new Array(); //Player/Platform contact
		this.proTerrContact = new Array();  //Projectile/Terrain contact
		this.proPlatContact = new Array();  //Projectile/Platform contact
		this.proHazContact = new Array();   //Projectile/Hazard contact
		this.bubProContact = new Array();   //Bubble/Projectile container
		
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

		//Main floating platform (not a pass-through)
		this.mainPlatform = this.game.add.sprite(game.world.width/2, game.world.height/2 -50, 'mPlat');
		this.game.physics.p2.enable(this.mainPlatform, this.DEBUG_BODIES);
		this.mainPlatform.body.clearShapes();
		this.mainPlatform.body.loadPolygon("mPlatPhysics", "mainPlatform");
		this.mainPlatform.body.static = true;
		this.mainPlatform.body.setCollisionGroup(this.terrainCollisionGroup);
		this.mainPlatform.body.collides([this.ballCollisionGroup, this.playerCollisionGroup]);
		this.mainPlatform.body.setMaterial(this.baseTerrainMaterial);

		
		//Light colored floating platform
		this.lightPlatform = this.game.add.sprite(game.world.width - 200, game.world.height/2 + 50, 'fPlatL');
		this.game.physics.p2.enable(this.lightPlatform, this.DEBUG_BODIES);
		this.lightPlatform.body.static = true;
		this.lightPlatform.body.setCollisionGroup(this.platformCollisionGroup);
		this.lightPlatform.body.collides([this.platformCollisionGroup, this.playerCollisionGroup, this.ballCollisionGroup]);
		this.platformMaterial = game.physics.p2.createMaterial('platformMaterial');
		this.lightPlatform.body.setMaterial(this.platformMaterial);

		//Dark colored floating platform
		this.darkPlatform = this.game.add.sprite(200, game.world.height/2 + 50, 'fPlatD');
		this.game.physics.p2.enable(this.darkPlatform, this.DEBUG_BODIES);
		this.darkPlatform.body.static = true;
		this.darkPlatform.body.setCollisionGroup(this.platformCollisionGroup);
		this.darkPlatform.body.collides([this.platformCollisionGroup, this.playerCollisionGroup, this.ballCollisionGroup]);
		this.darkPlatform.body.setMaterial(this.platformMaterial);

		//Hazard 1
		//Hazard = function(game, x, y, key, hazType, playerCollisionGroup, ballCollisionGroup, hazardCollisionGroup)
		this.hazard = new  Hazard(this.game, (game.world.width/2)-200, 590, 'acid', 1,
			this.playerCollisionGroup, this.ballCollisionGroup, this.hazardCollisionGroup);
		this.hazardMaterial = game.physics.p2.createMaterial('hazardMaterial');
		this.hazard.body.setMaterial(this.hazardMaterial);
		this.game.add.existing(this.hazard);
		this.hazardGroup.add(this.hazard);

		//Hazard 2
		//Hazard = function(game, x, y, key, hazType, playerCollisionGroup, ballCollisionGroup, hazardCollisionGroup)
		this.hazard2 = new  Hazard(this.game, (game.world.width/2)+200,  590, 'acid', 1,
			this.playerCollisionGroup, this.ballCollisionGroup, this.hazardCollisionGroup);
		this.hazard2.body.setMaterial(this.hazardMaterial);
		this.game.add.existing(this.hazard2);
		this.hazardGroup.add(this.hazard2);

		//Hazard 3, spike hazard test
		//Hazard = function(game, x, y, key, hazType, playerCollisionGroup, ballCollisionGroup, hazardCollisionGroup)
		this.hazard3 = new  Hazard(this.game, 70,  this.game.world.height/2 - 100, 'playerBubble', 2,
			this.playerCollisionGroup, this.ballCollisionGroup, this.hazardCollisionGroup);
		this.hazard3.body.setMaterial(this.hazardMaterial);
		this.game.add.existing(this.hazard3);
		this.hazardGroup.add(this.hazard3);

		/*
			Much of the code here could be refactored into the prefabs, 
			similar to how the hazard prefab is. It was not deemed worth 
			sacrificing the time to do so given that for much of our time
			with the project we had an incomplete group due to 
			extenuating medical circumstances.
		*/

		// Ball 1
		//Projectile = function(game, x, y, key, breakable, proNum, outerContext)
		this.ball1 = new Projectile(this.game, 230, 300, 'ball', false, 1, this);
		game.physics.p2.enable(this.ball1, this.DEBUG_BODIES);
		this.ball1.body.setCircle(16);
		this.projectileMaterials[1] = game.physics.p2.createMaterial('ball1Material');
		this.ball1.body.setMaterial(this.projectileMaterials[1]);
		this.ball1.body.setCollisionGroup(this.ballCollisionGroup);
		this.ball1.body.collides([this.ballCollisionGroup, this.playerCollisionGroup, 
			this.attackCollisionGroup, this.terrainCollisionGroup, this.hazardCollisionGroup, 
			this.bubbleCollisionGroup, this.platformCollisionGroup]);
		this.ballGroup.add(this.ball1);

		// Ball 2
		//Projectile = function(game, x, y, key, breakable, proNum, outerContext)
		this.ball2 = new Projectile(this.game, this.game.width - 230, 300, 'ball', false, 2, this);
		game.physics.p2.enable(this.ball2, this.DEBUG_BODIES);
		this.ball2.body.setCircle(16);
		this.projectileMaterials[2] = game.physics.p2.createMaterial('ball2Material');
		this.ball2.body.setMaterial(this.projectileMaterials[2]);
		this.ball2.body.setCollisionGroup(this.ballCollisionGroup);
		this.ball2.body.collides([this.ballCollisionGroup, this.playerCollisionGroup, 
			this.attackCollisionGroup, this.terrainCollisionGroup, this.hazardCollisionGroup, 
			this.bubbleCollisionGroup, this.platformCollisionGroup]);
		this.ballGroup.add(this.ball2);

		//Player bubble
		//This place holder bubble is only here to configure the collision mechanics and
		// is never truly used by anything else; it actually terminates itself shortly after creation
		//PlayerBubble = function(game, x, y, key, playNum, outerContext)
		this.bubblePlaceHolder = new PlayerBubble(this.game, 50, this.game.height - 100, 
			'playerBubble', 1, this);
		this.bubblePlaceHolder.alpha = 0;
		this.game.add.existing(this.bubblePlaceHolder);
		this.bubbleMaterials[1] = game.physics.p2.createMaterial('bubbleMaterial');
		this.bubbleMaterials[2] = this.bubbleMaterials[1];
		this.bubblePlaceHolder.body.setMaterial(this.bubbleMaterials[1]);
		this.bubblePlaceHolder.body.setCollisionGroup(this.bubbleCollisionGroup);
		this.bubblePlaceHolder.body.collides([this.ballCollisionGroup]);
		this.bubbleGroup.add(this.bubblePlaceHolder);

		//Breakable stage object
		//Projectile = function(game, x, y, key, breakable, proNum, outerContext)
		this.breakable = new Projectile(this.game, this.game.width/2, this.game.height/2 - 200, 'playerBubble', true, 3, this);
		this.game.add.existing(this.breakable);
		this.breakable.body.setCircle(16);
		this.projectileMaterials[3] = game.physics.p2.createMaterial('breakable1Material');
		this.breakable.body.setMaterial(this.projectileMaterials[3]);
		this.breakable.body.setCollisionGroup(this.ballCollisionGroup);
		this.breakable.body.collides([this.ballCollisionGroup, this.playerCollisionGroup, 
			this.attackCollisionGroup, this.terrainCollisionGroup, this.hazardCollisionGroup, 
			this.bubbleCollisionGroup, this.platformCollisionGroup]);
		this.breakableGroup.add(this.breakable);

		//Player 1
		//Player = function(game, x, y, key, playerNumber, attackGroup, attackCollisionGroup,
		// ballCollisionGroup, ballCollisionGroup, bubbleGroup, bubbleCollisionGroup, outerContext)
		this.player = new Player(this.game, this.game.width/2 - 40, this.game.height/2, 'golem', 1, 
			this.attackGroup, this.attackCollisionGroup, this.ballCollisionGroup, 
			this.bubbleGroup, this.bubbleCollisionGroup, this);
		if (!this.justStarted) { //if it's not a new game, carry over life count
			this.player.lives = this.p1Lives;
		}
		this.game.add.existing(this.player);
		this.player.body.setCircle(16); //may want to make the parameter a constant in the player prefab.
		this.player.body.collideWorldBounds = true;
		this.player.body.fixedRotation = true;
		this.player.body.dynamic = true; //This may actually be unnecessary.
		this.player.body.mass = this.player.PLAYER_MASS;
		this.player.body.damping = this.player.PLAYER_DAMPING;
		this.playerMaterials[1] = game.physics.p2.createMaterial('player1Material');
		this.player.body.setMaterial(this.playerMaterials[1]);
		this.player.body.setCollisionGroup(this.playerCollisionGroup);
		this.player.body.collides([this.ballCollisionGroup, this.terrainCollisionGroup, 
			this.hazardCollisionGroup, this.platformCollisionGroup]);
		this.playerGroup.add(this.player);
		this.player.animations.add('run', [0,1,2,3,4,5,6,7,8,9], 10, true);
		this.player.animations.play('run');

		//Player 2
		//Player = function(game, x, y, key, playerNumber, attackGroup, attackCollisionGroup, 
		//ballCollisionGroup, ballCollisionGroup, bubbleGroup, bubbleCollisionGroup, outerContext)
		this.player2 = new Player(this.game, this.game.width/2 + 40, this.game.height/2, 'golem', 2, 
			this.attackGroup, this.attackCollisionGroup, this.ballCollisionGroup, 
			this.bubbleGroup, this.bubbleCollisionGroup, this);
		if (!this.justStarted) { //if it's not a new game, carry over life count
			this.player2.lives = this.p2Lives;
		}
		this.game.add.existing(this.player2);
		this.player2.body.setCircle(16);
		this.player2.body.collideWorldBounds = true;
		this.player2.body.fixedRotation = true;
		this.player2.body.dynamic = true;
		this.player2.body.mass = this.player2.PLAYER_MASS;
		this.player2.body.damping = this.player2.PLAYER_DAMPING;
		this.playerMaterials[2] = game.physics.p2.createMaterial('player2Material');
		this.player2.body.setMaterial(this.playerMaterials[2]);
		this.player2.body.setCollisionGroup(this.playerCollisionGroup);
		this.player2.body.collides([this.ballCollisionGroup, this.terrainCollisionGroup, 
			this.hazardCollisionGroup, this.platformCollisionGroup]);
		this.playerGroup.add(this.player2);
		this.player2.animations.add('run', [0,1,2,3,4,5,6,7,8,9], 10, true);
		this.player2.animations.play('run');
		
		//This place holder attackZone is only here to configure the collision mechanics and
		// is never truly used by anything else; it actually terminates itself after a few update cycles
		//PlayerAttackZone = function(game, x, y, key, playNum, strength, direction, outerContext)
		this.attackZonePlaceHolder = new PlayerAttackZone(this.game, 50, this.game.height - 100, 
			'attackZone', 0, 0, 0, this);
		this.attackZonePlaceHolder.alpha = 0;
		this.game.add.existing(this.attackZonePlaceHolder);
		this.attackZonePlaceHolder.body.setCollisionGroup(this.attackCollisionGroup);
		this.attackZonePlaceHolder.body.collides(this.ballCollisionGroup, this.playerAttack, this);
		this.attackGroup.add(this.attackZonePlaceHolder); //don't know if this is truly necessary.

		//======Material configuration section======
		//-----Contact Materials key-----
		// FRICTION to use in the contact of these two materials.
		// RESTITUTION (i.e. how bouncy it is!) to use in the contact of these two materials. //mostly works. Flat 
																							  //surfaces: yes, angles: no
		// STIFFNESS of the resulting ContactEquation that this baseTerVsPlayContact generate.//causes some clipping with 
																							  //buoyant fluid motions
		// RELAXATION of the resulting ContactEquation that this baseTerVsPlayContact generate.
		// STIFFNESS of the resulting FrictionEquation that this baseTerVsPlayContact generate.
		// RELAXATION of the resulting FrictionEquation that this baseTerVsPlayContact generate.
		// Will add SURFACE VELOCITY to this material. If bodyA rests on top of bodyB, and the 
	    // surface velocity is positive, bodyA will slide to the right.

		// Terrain Vs Players contact
		for (var i = 1; i < 3; i++) { //2 players
			this.playTerrContact[i] = game.physics.p2.createContactMaterial(this.playerMaterials[i], 
				this.baseTerrainMaterial);
			this.playTerrContact[i].friction = 1.0;
		    this.playTerrContact[i].restitution = 0.0;
		    this.playTerrContact[i].stiffness = 1e7 * 2;
		    this.playTerrContact[i].relaxation = 3; 
		    this.playTerrContact[i].frictionStiffness = 1e7;
		    this.playTerrContact[i].frictionRelaxation = 3;
		    this.playTerrContact[i].surfaceVelocity = 0;
		}

		// Platform Vs Players contact
		for (var i = 1; i < 3; i++) { //2 players
			this.playPlatContact[i] = game.physics.p2.createContactMaterial(this.playerMaterials[i], 
				this.platformMaterial);
			this.playPlatContact[i].friction = 1.0;
		    this.playPlatContact[i].restitution = 0.0;
		    this.playPlatContact[i].stiffness = 1e7 * 2;
		    this.playPlatContact[i].relaxation = 3; 
		    this.playPlatContact[i].frictionStiffness = 1e7;
		    this.playPlatContact[i].frictionRelaxation = 3;
		    this.playPlatContact[i].surfaceVelocity = 0;
		}

	    // Terrain Vs Ball contact
	    for (var i = 1; i < 4; i++) { //this count will need to be change when/if more objects are added
		    this.proTerrContact[i] = game.physics.p2.createContactMaterial(this.projectileMaterials[i], 
		    	this.baseTerrainMaterial);
			this.proTerrContact[i].friction = 1.0;
		    this.proTerrContact[i].restitution = 0.5; //provides some bounce
		    this.proTerrContact[i].stiffness = 1e7;
		    this.proTerrContact[i].relaxation = 3;  
		    this.proTerrContact[i].frictionStiffness = 1e7;   
		    this.proTerrContact[i].frictionRelaxation = 3;
		    this.proTerrContact[i].surfaceVelocity = 0;
		}

		// Platform Vs Ball contact
	    for (var i = 1; i < 4; i++) {
		    this.proPlatContact[i] = game.physics.p2.createContactMaterial(this.projectileMaterials[i], 
		    	this.platformMaterial);
			this.proPlatContact[i].friction = 1.0;
		    this.proPlatContact[i].restitution = 0.5; //provides some bounce
		    this.proPlatContact[i].stiffness = 1e7;
		    this.proPlatContact[i].relaxation = 3;  
		    this.proPlatContact[i].frictionStiffness = 1e7;   
		    this.proPlatContact[i].frictionRelaxation = 3;
		    this.proPlatContact[i].surfaceVelocity = 0;
		}

	    // Hazard Vs Ball contact, same as terrain vs ball.
	    for (var i = 1; i < 4; i++) {
		    this.proHazContact[i] = game.physics.p2.createContactMaterial(this.projectileMaterials[i], 
		    	this.hazardMaterial);
			this.proHazContact[i].friction = 1.0;
		    this.proHazContact[i].restitution = 0.5;
		    this.proHazContact[i].stiffness = 100; //gives the balls a buoyant movement on hazards.
		    this.proHazContact[i].relaxation = 3;  
		    this.proHazContact[i].frictionStiffness = 1e7;   
		    this.proHazContact[i].frictionRelaxation = 3;
		    this.proHazContact[i].surfaceVelocity = 0;
		}

	    // Bubble Vs Ball contact
	    for (var i = 1; i < 3; i++) {
		    this.bubProContact[i] = game.physics.p2.createContactMaterial(this.projectileMaterials[i], 
		    	this.bubbleMaterials[i]);
			this.bubProContact[i].friction = 1.0;
		    this.bubProContact[i].restitution = 0.5;
		    this.bubProContact[i].stiffness = 1e7;
		    this.bubProContact[i].relaxation = 3;  
		    this.bubProContact[i].frictionStiffness = 1e7;   
		    this.bubProContact[i].frictionRelaxation = 3;
		    this.bubProContact[i].surfaceVelocity = 0;
		}

		// Non-pass through terrain callbacks
		game.physics.p2.setImpactEvents(true);
		this.player.body.createBodyCallback(this.baseTerrain, this.jumpReset);
		this.player2.body.createBodyCallback(this.baseTerrain, this.jumpReset);
		this.player.body.createBodyCallback(this.mainPlatform, this.jumpReset);
		this.player2.body.createBodyCallback(this.mainPlatform, this.jumpReset);

		//pass through callbacks
		this.player.body.createBodyCallback(this.lightPlatform, this.jumpReset);
		this.player2.body.createBodyCallback(this.lightPlatform, this.jumpReset);
		this.player.body.createBodyCallback(this.darkPlatform, this.jumpReset);
		this.player2.body.createBodyCallback(this.darkPlatform, this.jumpReset);

		//Player death callbacks
		this.player.body.createGroupCallback(this.ballCollisionGroup, this.hitByBall);
		this.player2.body.createGroupCallback(this.ballCollisionGroup, this.hitByBall);
		this.player.body.createGroupCallback(this.hazardCollisionGroup, this.hitByHazard);
		this.player2.body.createGroupCallback(this.hazardCollisionGroup, this.hitByHazard);

		//initializing UI elements
		for(var i = 0; i < this.player.lives; i++) {
			var healthbar = game.add.sprite((game.world.width/2)-(i*64)-128, game.world.height - 120, 'heart');
		}
		for(var j = 0; j < this.player2.lives; j++) {
			var healthbar2 = game.add.sprite((game.world.width/2)+(j*64)+64, game.world.height - 120, 'heart2');
		}
		var playText = game.add.text(game.width/2, game.world.height - 16, 
			'P1                                            P2', 
			{font: 'Helvetica', fontSize: '24px', fill: '#000000'});
		playText.anchor.set(0.5);
	},
	
	//PLAY STATE UPDATE
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

	//this processes the collisions and determines whether we want it to
	// be considered a valid collision (true) or not (false).
	checkCollision: function(body1, body2) {
		//if both bodies are player sprites, return false
		if ((body1.sprite === this.player && body2.sprite === this.player2) || 
			(body2.sprite === this.player && body1.sprite === this.player2)) {
			
			return false;

		//if the first body is a player, a ball, or a breakable and the second is a pass-through platform; return false
		//Note: this check will need to be expanded as new assets comes in and get implemented
		} else if ((body1.sprite === this.player || body1.sprite === this.player2 || body1.sprite === this.ball1 ||  
			body1.sprite === this.ball2 ||  body1.sprite === this.breakable) && (body2.sprite === this.lightPlatform || 
			body1.sprite === this.darkPlatform)) {

			if (body1.sprite.body.velocity.y < 0) {
				return false;
			}

		//if the second body is a player, a ball, or a breakable and the first is a pass-through platform; return false
		} else if ((body2.sprite === this.player || body2.sprite === this.player2 || body2.sprite === this.ball1 ||  
			body2.sprite === this.ball2 ||  body2.sprite === this.breakable) && (body1.sprite === this.lightPlatform || 
			body1.sprite === this.darkPlatform)) {

			if (body2.sprite.body.velocity.y < 0) {
				return false;
			}
		}

		//otherwise this collision is valid
		return true;
	},

	//player attack handling
	//this knocks the balls back when a player strikes them.
	//was written here early on when it was unclear if new
	//functions could be added to prefabs and has not yet
	//been refactored.
	playerAttack: function(body1, body2) {

		//if striking a breakable, make it break
		if (body2.sprite.isBreakable) {
			body2.sprite.unbroken = false;
			body2.sprite.body.fixedRotation = false;
		}

		//apply strike force
		body2.sprite.body.velocity.x = body1.sprite.STRIKE_STRENGTH * body1.sprite.direction;
		body2.sprite.body.velocity.y -= body1.sprite.STRIKE_STRENGTH / 2;

		//set projectile to lethal
		body2.sprite.isLethal = true;

		//the hitbox destroys itself
		body1.safeDestroy = true;
	},

	hitByBall: function(receiver, hitter) {	
		//check to make sure a player hasn't already died. Used to prevent dual player death.
		if (receiver.sprite.outerContext.player.alive && receiver.sprite.outerContext.player2.alive) {
			//checks if the object is not an unbroken breakable object.
			if (!hitter.sprite.isBreakable || (hitter.sprite.isBreakable && !hitter.sprite.unbroken)) {
				//checks for lethal projectile state
				if (hitter.sprite.isLethal) {

					//Death Audio
					receiver.sprite.playerDied.play();

					//removing any existing attackZone constraints in order to avoid a crash when the
					// owning player sprite dies first.
					receiver.sprite.outerContext.attackGroup.forEachAlive(function(attack){
						if (attack.playNum == receiver.sprite.playNum) {
							if (attack.lockConstraint != null) {
								game.physics.p2.removeConstraint(attack.lockConstraint);
								attack.lockConstraint = null;
							}
							attack.safeDestroy = true;
							attack.destroy();
						}
					});

					//removing any existing bubble attack constraints in order to avoid a crash when the
					// owning player sprite dies first.
					receiver.sprite.outerContext.bubbleGroup.forEachAlive(function(bubble){
						if (bubble.playNum == receiver.sprite.playNum) {
							if (bubble.lockConstraint != null) {
								game.physics.p2.removeConstraint(bubble.lockConstraint);
								bubble.lockConstraint = null;
							}
							bubble.safeDestroy = true;
							bubble.destroy();
						}
					});
				
					//Simple "shatter" animation
					var deathEmitter = game.add.emitter(receiver.sprite.x, receiver.sprite.y, 200);
					let gravity = new Phaser.Point(300, -100);
					deathEmitter.gravity = gravity;
					deathEmitter.makeParticles('fragment');		// image used for particles
					deathEmitter.setAlpha(0.5, 1);				// set particle alpha (min, max)
					deathEmitter.minParticleScale = 0.1;		// set min/max particle size
					deathEmitter.maxParticleScale = 0.3;
					deathEmitter.setXSpeed(-20,10);			// set min/max horizontal speed
					deathEmitter.setYSpeed(-80,60);			// set min/max vertical speed
					deathEmitter.start(false, 1000, 4, 50);	// (explode, lifespan, freq, quantity)
					deathEmitter.forEach(function(particle) {
						if (receiver.sprite.playNum == 1) {
							particle.tint = 0x470000;
						} else if (receiver.sprite.playNum == 2) {
							particle.tint = 0x00375e;
						}
					});

					//Kill Player
					receiver.sprite.kill();
					receiver.sprite.lives--;
					
					//Check Match Status
					if(receiver.sprite.outerContext.player.lives == 0 || receiver.sprite.outerContext.player2.lives == 0) {
						game.state.start('GameOver', true, false, receiver.sprite.outerContext.player.lives, receiver.sprite.outerContext.player2.lives);
					}
				
					//Display Score & Restart
	      			var scoreText = game.add.text(game.width/2, game.height/2, 'P1: ' + receiver.sprite.outerContext.player.lives + '  P2: ' + 
	      				receiver.sprite.outerContext.player2.lives, {font: 'Helvetica', fontSize: '48px', fill: '#fff'});
					scoreText.anchor.set(0.5);
					game.time.events.add(Phaser.Timer.SECOND * 2, function() { game.state.start('Play', true, false, false, 
						receiver.sprite.outerContext.player.lives, receiver.sprite.outerContext.player2.lives)});
				}
			}
		}
	},

	hitByHazard: function(receiver, hitter) {
		//check to make sure a player hasn't already died. Used to prevent dual player death.
		if (receiver.sprite.outerContext.player.alive && receiver.sprite.outerContext.player2.alive) {
			receiver.sprite.playerDied.play(); //death audio

			//removing any existing attackZone constraints in order to avoid a crash when the
			// owning player sprite dies first.
			receiver.sprite.outerContext.attackGroup.forEachAlive(function(attack){
				if (attack.playNum == receiver.sprite.playNum) {
					if (attack.lockConstraint != null) {
						game.physics.p2.removeConstraint(attack.lockConstraint);
						attack.lockConstraint = null;
					}
					attack.safeDestroy = true;
					attack.destroy();
				}
			});

			//removing any existing bubble attack constraints in order to avoid a crash when the
			// owning player sprite dies first.
			receiver.sprite.outerContext.bubbleGroup.forEachAlive(function(bubble){
				if (bubble.playNum == receiver.sprite.playNum) {
					if (bubble.lockConstraint != null) {
						game.physics.p2.removeConstraint(bubble.lockConstraint);
						bubble.lockConstraint = null;
					}
					bubble.safeDestroy = true;
					bubble.destroy();
				}
			});

			//Simple "shatter" animation
			var deathEmitter = game.add.emitter(receiver.sprite.x, receiver.sprite.y, 200);
			let gravity = new Phaser.Point(300, -100);
			deathEmitter.gravity = gravity;
			deathEmitter.makeParticles('fragment');		// image used for particles
			deathEmitter.setAlpha(0.5, 1);				// set particle alpha (min, max)
			deathEmitter.minParticleScale = 0.1;		// set min/max particle size
			deathEmitter.maxParticleScale = 0.3;
			deathEmitter.setXSpeed(-20,10);			// set min/max horizontal speed
			deathEmitter.setYSpeed(-80,60);			// set min/max vertical speed
			deathEmitter.start(false, 1000, 4, 50);	// (explode, lifespan, freq, quantity)
			deathEmitter.forEach(function(particle) {
				if (receiver.sprite.playNum == 1) {
					particle.tint = 0x470000;
				} else if (receiver.sprite.playNum == 2) {
					particle.tint = 0x00375e;
				}
			});

			//kill player
			receiver.sprite.kill();
			receiver.sprite.lives--;
			//console.log('Player ' + receiver.sprite.playNum + ': ' + receiver.sprite.lives + ' lives remaining.');

			//checking for game over and transitioning to game over state
			if(receiver.sprite.outerContext.player.lives == 0 || receiver.sprite.outerContext.player2.lives == 0) {
					game.state.start('GameOver', true, false, receiver.sprite.outerContext.player.lives, 
						receiver.sprite.outerContext.player2.lives);
			}

			//updating ui
			var scoreText = game.add.text(game.width/2, game.height/2, 'P1: ' + 
				receiver.sprite.outerContext.player.lives + '  P2: ' + 
				receiver.sprite.outerContext.player2.lives, {font: 'Helvetica', fontSize: '48px', fill: '#fff'});
			scoreText.anchor.set(0.5);

			//starting timer that restarts play state for the next round
			game.time.events.add(Phaser.Timer.SECOND * 2, function() { game.state.start('Play', 
				true, false, false, receiver.sprite.outerContext.player.lives, 
				receiver.sprite.outerContext.player2.lives)});
		}
	},
};