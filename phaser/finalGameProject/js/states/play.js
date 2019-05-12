// Play state

var Play = function(game) {};
Play.prototype = {
	create: function() {
		game.physics.startSystem(Phaser.Physics.P2JS);

		game.stage.setBackgroundColor('#87CEEB');

		// make gravity affect all objects, player collides with world, and player never rotates when it collides with anything
		game.physics.p2.gravity.y = 500; // previously 300

		//this prevents players from bumping into each other.
		game.physics.p2.setPostBroadphaseCallback(this.checkPlayerVsPlayerCollision, this);


		//this group will be populated when the player attacks. A group is needed so it can be passed around and also checked out here.
		this.attackCollisionGroup = game.physics.p2.createCollisionGroup();
		this.playerCollisionGroup = game.physics.p2.createCollisionGroup();
		this.ballCollisionGroup = game.physics.p2.createCollisionGroup();
		this.terrainCollisionGroup = game.physics.p2.createCollisionGroup();

		game.physics.p2.updateBoundsCollisionGroup();

		this.terrainGroup = game.add.group();
		this.terrainGroup.enableBody = true;
		this.terrainGroup.physicsBodyType = Phaser.Physics.P2JS;

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
		//adds halfpipe with custom hitbox and is static
		this.halfpipe = this.terrainGroup.create(game.world.width/2, game.world.height/2, 'halfpipe');
		this.game.physics.p2.enable(this.halfpipe, false);
        this.halfpipe.body.clearShapes();
		this.halfpipe.body.loadPolygon("physics", "halfpipe");
		this.halfpipe.body.static = true;
		this.halfpipe.body.setCollisionGroup(this.terrainCollisionGroup);
		this.halfpipe.body.collides([this.ballCollisionGroup, this.playerCollisionGroup]);

		// Ball 1
		//this.ball1 = this.ballGroup.create(150, 60, 'ball');
		this.ball1 = game.add.sprite(150, 60, 'ball');
		this.ball1.tint = 0xc242f4;
		game.physics.p2.enable(this.ball1, false);
		this.ball1.body.setCircle(18);
		this.ball1.body.setCollisionGroup(this.ballCollisionGroup);
		this.ball1.body.collides([this.ballCollisionGroup, this.playerCollisionGroup, this.attackCollisionGroup, this.terrainCollisionGroup]);
		this.ballGroup.add(this.ball1);

		//Ball 2
		//this.ball2 = this.ballGroup.create(this.game.width - 150, 60, 'ball');
		this.ball2 = game.add.sprite(this.game.width - 150, 60, 'ball');
		this.ball2.tint = 0xf4ee41;
		game.physics.p2.enable(this.ball2, false);
		this.ball2.body.setCircle(18);
		this.ball2.body.setCollisionGroup(this.ballCollisionGroup);
		this.ball2.body.collides([this.ballCollisionGroup, this.playerCollisionGroup, this.attackCollisionGroup, this.terrainCollisionGroup]);
		this.ballGroup.add(this.ball2);

		//Player 1
		//Player = function(game, x, y, key, playerNumber, attackGroup, attackCollisionGroup,ballCollisionGroup, outerContext)
		this.player = new Player(this.game, this.game.width/2 + 40, this.game.height/2, 'tacoLizard', 1, this.attackGroup, this.attackCollisionGroup, this.ballCollisionGroup, this);
		this.game.add.existing(this.player);
		this.player.body.collideWorldBounds = true;
		this.player.body.fixedRotation = true;
		this.player.body.dynamic = true;
		this.player.body.setCollisionGroup(this.playerCollisionGroup);
		this.player.body.collides([this.ballCollisionGroup, this.terrainCollisionGroup]);
		this.playerGroup.add(this.player);

		//Player 2
		//Player = function(game, x, y, key, playerNumber, attackGroup, attackCollisionGroup,ballCollisionGroup, outerContext)
		this.player2 = new Player(this.game, this.game.width/2 - 40, this.game.height/2, 'tacoLizard', 2, this.attackGroup, this.attackCollisionGroup, this.ballCollisionGroup, this);
		this.game.add.existing(this.player2);
		this.player2.body.collideWorldBounds = true;
		this.player2.body.fixedRotation = true;
		this.player2.body.dynamic = true;
		this.player2.body.setCollisionGroup(this.playerCollisionGroup);
		this.player2.body.collides([this.ballCollisionGroup, this.terrainCollisionGroup]);
		this.playerGroup.add(this.player2);

		//PlayerAttackZone = function(game, x, y, key, strength, direction, outerContext)
		this.attackZonePlaceHolder = new PlayerAttackZone(this.game, -40, -40, 'attackZone', 0, 0, this);
		this.game.add.existing(this.attackZonePlaceHolder);
		this.attackZonePlaceHolder.body.setCollisionGroup(this.attackCollisionGroup);
		this.attackZonePlaceHolder.body.collides(this.ballCollisionGroup, this.playerAttack, this);
		this.attackGroup.add(this.attackZonePlaceHolder); //don't know if this is truly necessary.

		// create callback event if player hits halfpipe
		game.physics.p2.setImpactEvents(true);
		this.player.body.createBodyCallback(this.halfpipe, this.jumpReset);
		this.player2.body.createBodyCallback(this.halfpipe, this.jumpReset);

	},
	
	update: function() {

    	if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
    		game.state.start('GameOver');
    	}
	},
	
	// makes jump variable true if you do collide with halfpipe
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
	playerAttack: function(body1, body2) {
		console.log(body1);
		console.log(body2);
		body2.sprite.body.velocity.x = body1.sprite.STRIKE_STRENGTH * body1.sprite.direction;
		body1.safeDestroy = true;
	}
};