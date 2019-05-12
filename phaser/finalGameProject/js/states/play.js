// Play state

var Play = function(game) {};
Play.prototype = {
	create: function() {
		game.physics.startSystem(Phaser.Physics.P2JS);

		game.stage.setBackgroundColor('#87CEEB');

		//adds halfpipe with custom hitbox and is static
		this.halfpipe = game.add.sprite(game.world.width/2, game.world.height/2, 'halfpipe')
		this.game.physics.p2.enable(this.halfpipe, false);
        this.halfpipe.body.clearShapes();
		this.halfpipe.body.loadPolygon("physics", "halfpipe");
		this.halfpipe.body.static = true;

		// make gravity affect all objects, player collides with world, and player never rotates when it collides with anything
		game.physics.p2.gravity.y = 500; // previously 300

		this.player = new Player(this.game, this.game.width/2 + 40, this.game.height/2, 'tacoLizard', 1);
		this.game.add.existing(this.player);
		this.player.body.collideWorldBounds = true;
		this.player.body.fixedRotation = true;
		this.player.body.dynamic = true;

		this.player2 = new Player(this.game, this.game.width/2 - 40, this.game.height/2, 'tacoLizard', 2);
		this.game.add.existing(this.player2);
		this.player2.body.collideWorldBounds = true;
		this.player2.body.fixedRotation = true;
		this.player2.body.dynamic = true;

		this.ball1 = game.add.sprite(150, 60, 'ball');
		this.ball1.tint = 0xc242f4;
		game.physics.p2.enable(this.ball1, false);
		this.ball1.body.setCircle(18);

		this.ball2 = game.add.sprite(this.game.width - 150, 60, 'ball');
		this.ball2.tint = 0xf4ee41;
		game.physics.p2.enable(this.ball2, false);
		this.ball2.body.setCircle(18);

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
	}
};