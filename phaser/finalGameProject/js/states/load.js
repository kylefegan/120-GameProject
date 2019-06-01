// Load state

var Load = function(game) {};
Load.prototype = {
	preload: function() {
		// load graphic assets that were all made by group members
		game.load.path = 'assets/img/';
		game.load.image('tacoLizard', 'tacoLizard.png');
		game.load.image('baseTerrain', 'PyramidLevel.png');
		//game.load.image('fire', 'fire.png');
		game.load.image('acid', 'acidPool.png');
		game.load.physics("physics", "PyramidLevel.json", null, Phaser.Physics.LIME_CORONA_JSON);
		game.load.image('ball', 'Boulder.png');
		game.load.image('heart', 'heartJar.png');
		game.load.image('heart2', 'heartJar2.png');
		game.load.image('attackZone', 'playerAttackZone.png'); //it's a transparent box image.
		game.load.image('ControlMenu', 'Controls Menu.png');
		game.load.spritesheet('ControlAnimation', 'Controls animation.png', 1000, 550);
		game.load.spritesheet('playbutton', 'Play button.png', 400, 150);
		game.load.spritesheet('controlbutton', 'Controls button.png', 400, 150);
		game.load.spritesheet('screenTransition', 'screenTransition.png',250,200);
		
		game.load.image('cloud1', 'cloud1.png');
		game.load.image('cloud2', 'cloud2.png');
		game.load.image('cloud3', 'cloud3.png');
		game.load.image('cloud4', 'cloud4.png');
		game.load.image('cloud5', 'cloud5.png');
		game.load.image('cloud6', 'cloud6.png');
		
		game.load.spritesheet('golem', 'golemtest.png', 32, 32);

		// load audio assets
		game.load.path = 'assets/audio/';
		game.load.audio('playerDied', 'Downer01.mp3');
		game.load.audio('buttonHover', 'buttonHover.mp3');
		game.load.audio('buttonDown', 'transitionSound.mp3');
		
	},
	create: function() {
		// go to Title state
		game.state.start('Title');
	}
};