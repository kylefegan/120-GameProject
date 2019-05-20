// Load state

var Load = function(game) {};
Load.prototype = {
	preload: function() {
		// load graphic assets that were all made by group members
		game.load.path = 'assets/img/';
		game.load.image('tacoLizard', 'tacoLizard.png');
		game.load.image('baseTerrain', 'PyramidLevel.png');
		game.load.image('fire', 'fire.png');
		game.load.physics("physics", "PyramidLevel.json", null, Phaser.Physics.LIME_CORONA_JSON);
		game.load.image('ball', 'ball.png');
		game.load.image('heart', 'heartJar.png');
		game.load.image('heart2', 'heartJar2.png');
		game.load.image('attackZone', 'playerAttackZone.png'); //it's a transparent box image.
		
		game.load.spritesheet('golem', 'golemtest.png', 32, 32);

		// load audio assets
		game.load.path = 'assets/audio/';
		game.load.audio('playerDied', 'Downer01.mp3');
		
	},
	create: function() {
		// go to Title state
		game.state.start('Title');
	}
};