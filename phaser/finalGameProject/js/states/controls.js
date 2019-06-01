// Control state

var Controls = function(game) {};
Controls.prototype = {
	create: function() {
		var controls = game.add.sprite(0, 0, 'ControlMenu');

		var controlsAnimate = game.add.sprite(0, 250, 'ControlAnimation');
		controlsAnimate.animations.add('cycle', [0,1,2,3,4,5,6,7,8], 1, true);
		controlsAnimate.animations.play('cycle');

		var playText = game.add.text(game.width/2, game.height*.1, 'Fast moving balls kill players. Last one standing wins.', {font: 'Palatino', fontSize: '24px', fill: '#000'});
		playText.anchor.set(0.5);

		var playText = game.add.text(game.width/2, game.height*.2, 'P1 = wasd keys to move, "c" knocks balls\nP2 = arrow keys to move, "," knocks balls\nPress "w" to start playing', {font: 'Palatino', fontSize: '24px', fill: '#000'});
		playText.anchor.set(0.5);

		// creates play button
		/*var playButton = game.add.button(game.width/2, game.height*.7, 'playbutton', this.goPlay, this,1, 0, 2);
		playButton.anchor.set(0.5);*/

	},
	update: function() {
		if(game.input.keyboard.isDown(Phaser.Keyboard.W)) {
			game.state.start('Play', true, false, true, 0, 0);
		}
	}
	/*goPlay: function() {
		//clear world: true, clear cache: false, freshStart: true, playerOneLives: 0 (will be overwritten), playerTwoLives: 0 (will be overwritten)
		//game.time.events.add(Phaser.Timer.SECOND * 2, function() {
			game.state.start('Play', true, false, true, 0, 0);
		//});
	}*/
};