// Play state

var Play = function(game) {};
Play.prototype = {
	create: function() {
		this.DEBUG_BODIES = false; //this will toggle p2 physics debug bodies in this file. Check player and playerAttackZone prefabs for their bodies.


		game.physics.startSystem(Phaser.Physics.P2JS);

		game.stage.setBackgroundColor('#87CEEB'); //stage background color: light blue

		// make gravity affect all objects, player collides with world, and player never rotates when it collides with anything
		game.physics.p2.gravity.y = 500; // previously 300

		//this prevents players from bumping into each other.
		game.physics.p2.setPostBroadphaseCallback(this.checkPlayerVsPlayerCollision, this);

		//collision groups
		this.attackCollisionGroup = game.physics.p2.createCollisionGroup();//this group will be populated when the player attacks. A group is needed so it can be passed around and also checked out here.
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
		
		//Terrain
		//adds base terrain with custom hitbox and is static
		this.halfpipe = this.terrainGroup.create(game.world.width/2, game.world.height/2, 'halfpipe');
		this.game.physics.p2.enable(this.halfpipe, this.DEBUG_BODIES);
        this.halfpipe.body.clearShapes();
		this.halfpipe.body.loadPolygon("physics", "PyramidLevel");
		this.halfpipe.body.static = true;
		this.halfpipe.body.setCollisionGroup(this.terrainCollisionGroup);
		this.halfpipe.body.collides([this.ballCollisionGroup, this.playerCollisionGroup]);

		//Hazard
		//adds static hazard 
		this.hazard = new  Hazard(this.game, (game.world.width/2)-200, 590, 'acid', this.playerCollisionGroup, this.ballCollisionGroup, this.hazardCollisionGroup);
		this.game.add.existing(this.hazard);
		this.hazard2 = new  Hazard(this.game, (game.world.width/2)+200, 590, 'acid', this.playerCollisionGroup, this.ballCollisionGroup, this.hazardCollisionGroup);
		this.game.add.existing(this.hazard2);


		// Ball 1
		//this.ball1 = this.ballGroup.create(150, 60, 'ball');
		this.ball1 = game.add.sprite(230, 300, 'ball');
		//this.ball1.tint = 0xc242f4;
		game.physics.p2.enable(this.ball1, this.DEBUG_BODIES);
		this.ball1.body.setCircle(16);
		this.ball1.body.setCollisionGroup(this.ballCollisionGroup);
		this.ball1.body.collides([this.ballCollisionGroup, this.playerCollisionGroup, this.attackCollisionGroup, this.terrainCollisionGroup, this.hazardCollisionGroup]);
		this.ballGroup.add(this.ball1);

		// Ball 2
		//this.ball2 = this.ballGroup.create(this.game.width - 150, 60, 'ball');
		this.ball2 = game.add.sprite(this.game.width - 230, 300, 'ball');
		//this.ball2.tint = 0xf4ee41;
		game.physics.p2.enable(this.ball2, this.DEBUG_BODIES);
		this.ball2.body.setCircle(16);
		this.ball2.body.setCollisionGroup(this.ballCollisionGroup);
		this.ball2.body.collides([this.ballCollisionGroup, this.playerCollisionGroup, this.attackCollisionGroup, this.terrainCollisionGroup, this.hazardCollisionGroup]);
		this.ballGroup.add(this.ball2);

		//Player 1
		//Player = function(game, x, y, key, playerNumber, attackGroup, attackCollisionGroup,ballCollisionGroup, outerContext)
		this.player = new Player(this.game, this.game.width/2 - 40, this.game.height/2, 'golem', 1, this.attackGroup, this.attackCollisionGroup, this.ballCollisionGroup, this);
		this.game.add.existing(this.player);
		this.player.body.setCircle(16);
		this.player.body.collideWorldBounds = true;
		this.player.body.fixedRotation = true;
		this.player.body.dynamic = true; //This may actually be unnecessary.
		this.player.body.setCollisionGroup(this.playerCollisionGroup);
		this.player.body.collides([this.ballCollisionGroup, this.terrainCollisionGroup, this.hazardCollisionGroup]);
		this.playerGroup.add(this.player);
		//Animation
			this.player.animations.add('run', [0,1,2,3,4,5,6,7,8,9], 10, true);
			this.player.animations.play('run');

		//Player 2
		//Player = function(game, x, y, key, playerNumber, attackGroup, attackCollisionGroup,ballCollisionGroup, outerContext)
		this.player2 = new Player(this.game, this.game.width/2 + 40, this.game.height/2, 'golem', 2, this.attackGroup, this.attackCollisionGroup, this.ballCollisionGroup, this);
		this.game.add.existing(this.player2);
		this.player2.body.setCircle(16);
		this.player2.body.collideWorldBounds = true;
		this.player2.body.fixedRotation = true;
		this.player2.body.dynamic = true;
		this.player2.body.setCollisionGroup(this.playerCollisionGroup);
		this.player2.body.collides([this.ballCollisionGroup, this.terrainCollisionGroup, this.hazardCollisionGroup]);
		this.playerGroup.add(this.player2);
		//Animation
			this.player2.animations.add('run', [0,1,2,3,4,5,6,7,8,9], 10, true);
			this.player2.animations.play('run');
		
		//PlayerAttackZone = function(game, x, y, key, strength, direction, outerContext)
		this.attackZonePlaceHolder = new PlayerAttackZone(this.game, -50, 0, 'attackZone', 0, 0, this);
		this.game.add.existing(this.attackZonePlaceHolder);
		this.attackZonePlaceHolder.body.setCollisionGroup(this.attackCollisionGroup);
		//this.attackZonePlaceHolder.body.setCircle(5);
		this.attackZonePlaceHolder.body.collides(this.ballCollisionGroup, this.playerAttack, this);
		this.attackGroup.add(this.attackZonePlaceHolder); //don't know if this is truly necessary.

		// create callback event if player hits halfpipe
		game.physics.p2.setImpactEvents(true);
		this.player.body.createBodyCallback(this.halfpipe, this.jumpReset);
		this.player2.body.createBodyCallback(this.halfpipe, this.jumpReset);

		//create callback for ball or hazards with players to kill players when hit
		this.player.body.createGroupCallback(this.ballCollisionGroup, this.hitByBall);
		this.player2.body.createGroupCallback(this.ballCollisionGroup, this.hitByBall);
		this.player.body.createGroupCallback(this.hazardCollisionGroup, this.hitByHazard);
		this.player2.body.createGroupCallback(this.hazardCollisionGroup, this.hitByHazard);

		for(var i = 0; i < player1Lives; i++) {
			var healthbar = game.add.sprite((game.world.width/2)-(i*64)-64,32, 'heart');
		}
		for(var j = 0; j < player2Lives; j++) {
			var healthbar2 = game.add.sprite((game.world.width/2)+(j*64),32, 'heart2');
		}

		var playText = game.add.text(game.width/2, 16, 'P1                                             P2', {font: 'Helvetica', fontSize: '24px', fill: '#fff'});
		playText.anchor.set(0.5);
	},
	
	update: function() {
		//Check prefab update functions for more information on updates.
    	if(game.input.keyboard.isDown(Phaser.Keyboard.R)) {
    		game.state.start('GameOver');
    	}
	},
	
	// Player jump count resets on collision with "halfpipe."
	// This also means players can effectively wall jump. May need to address this later.
	jumpReset: function(thisBody, impactedBody) {
		thisBody.sprite.jumps = thisBody.sprite.MAX_JUMP;
	},

	//this will need to change when new assets come in.
	checkPlayerVsPlayerCollision: function(body1, body2) {
		if ((body1.sprite === this.player && body2.sprite === this.player2) || (body2.sprite === this.player && body1.sprite === this.player2)) {
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

	hitByBall: function(receiver, hitter)
	{
		// NOTES (5/20/19):
		// -- Kyle Fegan --
		// I've rewritten the function to take into account horizontal and vertical velocity.
		// When a player OR a physics object is traveling above lethal velocity when a
		// collision occurs, the player will die.
		// CURRENT ISSUES: 
		//  -> Player/Ball physics interactions cause potential velocity innacuracies on lethal collision.
		//  -> Players have instant acceleration and therefore run velocity is always lethal.
		
		//Velocity Variables
		var lethalVelocity = 9;
		var hVelocity = Math.sqrt(Math.abs((hitter.sprite.body.velocity.x)^2 + (hitter.sprite.body.velocity.y)^2));
		var rVelocity = Math.sqrt(Math.abs((receiver.sprite.body.velocity.x)^2 + (receiver.sprite.body.velocity.y)^2));
		
		//DEBUG Console Log
		console.log('Hitter Velocity: ' + hVelocity + ' || ' + 'Receiver Velocity: ' + rVelocity);
		
		//Check for lethal damage
		if (hVelocity > lethalVelocity || rVelocity > lethalVelocity)
		{
			//Death Audio
			receiver.sprite.playerDied.play();
			
			//Kill Player
			//receiver.sprite.destroy();
			receiver.sprite.kill();
			if (receiver.sprite.playNum == 1) player1Lives--;
			else player2Lives--;
			
			//Check Match Status
			if(player1Lives == 0 || player2Lives == 0) game.state.start('GameOver');
			
			//Display Score & Restart
			var scoreText = game.add.text(game.width/2, game.height/2, 'P1: ' + player1Lives + '  P2: ' + player2Lives, {font: 'Helvetica', fontSize: '48px', fill: '#fff'});
			scoreText.anchor.set(0.5);
			game.time.events.add(Phaser.Timer.SECOND * 2, function() { game.state.start('Play')});
		}
	},

	hitByHazard: function(receiver, hitter) {
		receiver.sprite.playerDied.play(); //death audio
		//receiver.sprite.kill();
		receiver.sprite.kill();//using destroy to prevent players spawning attack zones while dead.
		if(receiver.sprite.playNum == 1) {
			player1Lives--;
			console.log('player1: ' + player1Lives);
		} else {
			player2Lives--;
			console.log('player2: ' + player2Lives);
		}
		if(player1Lives == 0 || player2Lives == 0) {
				game.state.start('GameOver');
		}
		var scoreText = game.add.text(game.width/2, game.height/2, 'P1: ' + player1Lives + '  P2: ' + player2Lives, {font: 'Helvetica', fontSize: '48px', fill: '#fff'});
		scoreText.anchor.set(0.5);
		game.time.events.add(Phaser.Timer.SECOND * 2, function() { game.state.start('Play')});
	},

	

};