// Load state

var Load = function(game) {};
Load.prototype = {
	preload: function() {
		//Load Graphics Assets
		game.load.path = 'assets/img/';
		game.load.image('baseTerrain', 'PyramidLevel.png');
		game.load.image('acid', 'acidPool.png');
		game.load.image('fragment', 'fragment.png');
		game.load.physics("physics", "PyramidLevel.json", null, Phaser.Physics.LIME_CORONA_JSON);
		game.load.image('ball', 'Boulder.png');
		game.load.image('playerBubble', 'ball.png');
		game.load.image('playerBubble2', 'ball1.png');
		game.load.image('heart', 'heartJar.png');
		game.load.image('heart2', 'heartJar2.png');
		game.load.image('attackZone', 'playerAttackZone.png'); //it's a transparent box image.
		game.load.image('ControlMenu', 'Controls Menu.png');
		game.load.image('Title', 'Title Screen.png');
		game.load.image('mPlat', 'mainPlatform.png');
		game.load.image('column1', 'columnPiece1.png');
		game.load.image('column2', 'columnPiece2.png');
		game.load.image('column3', 'columnPiece3.png');
		game.load.image('fPlatL', 'floatingPlatformLight.png');
		game.load.image('fPlatD', 'floatingPlatformDark.png');
		game.load.image('End1', 'EndScreen1.png');
		game.load.image('End2', 'EndScreen2.png');
		
		//Sprite Sheets
		game.load.spritesheet('ControlAnimation', 'Controls animation.png', 1000, 550);
		game.load.spritesheet('playbutton', 'Play button.png', 400, 150);
		game.load.spritesheet('controlbutton', 'Controls button.png', 400, 150);
		game.load.spritesheet('next', 'NextButton.png', 64, 80);
		game.load.spritesheet('screenTransition', 'screenTransition.png',250,200);
		game.load.spritesheet('block', 'ball.png', 32, 32);
		game.load.spritesheet('attack', 'attack.png', 16, 16);
		game.load.spritesheet('attack1', 'attack1.png', 16, 16);
		game.load.spritesheet('victory1', 'victory1.png', 128, 128);
		game.load.spritesheet('victory2', 'victory2.png', 128, 128);
		
		//Skybox
		game.load.image('cloud1', 'cloud1.png');
		game.load.image('cloud2', 'cloud2.png');
		game.load.image('cloud3', 'cloud3.png');
		game.load.image('cloud4', 'cloud4.png');
		game.load.image('cloud5', 'cloud5.png');
		game.load.image('cloud6', 'cloud6.png');
		
		//Player Sheets
		game.load.spritesheet('golem', 'golem.png', 32, 32);
		game.load.spritesheet('golem2', 'golem2.png', 32, 32);

		//Load Audio Assets
		game.load.path = 'assets/audio/';
		game.load.audio('playerDied', 'playerDeath.wav');
		game.load.audio('pAttack', 'playerAttack.wav');
		game.load.audio('pBubble', 'playerBubble.wav');
		game.load.audio('pBubbleCooldown', 'playerBubbleCooldown.wav');
		game.load.audio('buttonHover', 'buttonHover.mp3');
		game.load.audio('buttonDown', 'transitionSound.mp3');
		game.load.audio('crowd', 'crowd-cheer.mp3');
		//soundtrack
		game.load.audio('soundtrack', 'pyramidSong.mp3');
		
	},
	create: function() {
		// go to Title state
		game.state.start('Title');
	}
};