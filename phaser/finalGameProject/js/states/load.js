// Load state

var Load = function(game) {};
Load.prototype = {
	preload: function() {
		// load graphics assets that were all made by me (Derek) using piskel (a pixel art website)
		game.load.path = 'assets/img/';
		//game.load.tilemap('level', 'mapData.json', null, Phaser.Tilemap.TILED_JSON);
		//game.load.spritesheet('factoryLand', 'factoryLand.png', 70, 70);
		game.load.image('tacoLizard', 'tacoLizard.png');
		game.load.image('halfpipe', 'halfpipe.png');
		game.load.image('fire', 'fire.png');
		game.load.physics("physics", "final game.json", null, Phaser.Physics.LIME_CORONA_JSON);
		game.load.image('ball', 'ball.png');
		game.load.image('attackZone', 'playerAttackZone.png'); //it's a transparent box image.

		// load audio assets
		//game.load.path = 'assets/audio/';
		/*game.load.audio('beats', ['beats.mp3']);
		game.load.audio('death', ['death.mp3']);
		game.load.audio('turn', ['turn.mp3']);*/
	},
	create: function() {
		// go to Title state
		game.state.start('Title');
	}
};