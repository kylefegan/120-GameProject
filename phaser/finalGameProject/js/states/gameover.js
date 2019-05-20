// Game Over state

var GameOver = function(game) {};
GameOver.prototype = {
	init: function(playerOneLives, playerTwoLives) {
		this.p1Lives = playerOneLives;
		this.p2Lives = playerTwoLives;
	},

	create: function() {
		if (this.p1Lives == 0) {
			var playText = game.add.text(game.width/2, game.height*.4, 'Player 2 Wins', {font: 'Helvetica', fontSize: '48px', fill: '#fff'});
			playText.anchor.set(0.5);
		} else if (this.p2Lives == 0) {
			var playText = game.add.text(game.width/2, game.height*.4, 'Player 1 Wins', {font: 'Helvetica', fontSize: '48px', fill: '#fff'});
			playText.anchor.set(0.5);
		}
		var playText = game.add.text(game.width/2, game.height*.6, 'Press UP ARROW to Restart', {font: 'Helvetica', fontSize: '24px', fill: '#fff'});
		playText.anchor.set(0.5);
	},

	update: function() {
		// wait for keyboard input
		if(game.input.keyboard.justPressed(Phaser.Keyboard.UP)) {
			//clear world: true, clear cache: false, freshStart: true, playerOneLives: 0 (will be overwritten), playerTwoLives: 0 (will be overwritten)
			game.state.start('Play', true, false, true, 0, 0);
		}
	}
};