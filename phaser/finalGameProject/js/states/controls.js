// Control state

var Controls = function(game) {};
Controls.prototype = {
	create: function() {
		var controls = game.add.sprite(0, 0, 'ControlMenu');

		var controlsAnimate = game.add.sprite(0, 250, 'ControlAnimation');
		controlsAnimate.animations.add('cycle', [0,1,2,3,4,5,6,7,8], 1, true);
		controlsAnimate.animations.play('cycle');

		var playText = game.add.text(game.width/2, game.height*.14, 'Players cant hit each other directly, only fast moving objects kills. There \nis destructible pillars on the stage that can be attacked. All players can \ndouble jump and fast fall. Last one standing wins.', {font: 'Palatino', fontSize: '24px', fill: '#000'});
		playText.anchor.set(0.5);

		var playText = game.add.text(game.width/2, game.height*.24, 'P1 = wasd keys to move, "c" knocks objects, "v" creates a shield, Press "r" to end the game\nP2 = arrow keys to move, "," knocks objects, "." creates a shield                               Play-', {font: 'Palatino', fontSize: '20px', fill: '#000'});
		playText.anchor.set(0.5);

		nextButton = game.add.button(game.width*.915, game.height*.24, 'next', this.goNext, this,1, 0, 2);

		playText.anchor.set(0.5);

		nextButton = game.add.button(game.width*.915, game.height*.24, 'next', this.goNext, this,1, 0, 2);
		nextButton.anchor.set(0.5);
		nextButton.onOverSound = game.add.audio('buttonHover');
		nextButton.onDownSound = game.add.audio('buttonDown');

	},
	update: function() {
	},
	goNext: function() {
		// makes button stay on down frame when pressed
		nextButton.freezeFrames = true;

		// spawns an animation fading to white
		transition = game.add.sprite(0, 0, 'screenTransition', 0);
		transition.scale.x = 4;
		transition.scale.y = 4;
		transition.animations.add('fade', [0,1,2,3,4,5,6,7,8,9], 8);
		transition.animations.play('fade');

		// goes to next game state after 1.5 seconds
		game.time.events.add(Phaser.Timer.SECOND * 1.5, function() {
			game.state.start('Play', true, false, true, 0, 0);
		});
	}
};