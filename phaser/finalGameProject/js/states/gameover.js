// Game Over state

var GameOver = function(game) {};
GameOver.prototype = {
	create: function() {
		if(player1Lives == 0) {
			var playText = game.add.text(game.width/2, game.height*.4, 'Player 2 Wins', {font: 'Helvetica', fontSize: '48px', fill: '#fff'});
			playText.anchor.set(0.5);
		} else {
			var playText = game.add.text(game.width/2, game.height*.4, 'Player 1 Wins', {font: 'Helvetica', fontSize: '48px', fill: '#fff'});
			playText.anchor.set(0.5);
		}
		var playText = game.add.text(game.width/2, game.height*.6, 'Press UP ARROW to Restart', {font: 'Helvetica', fontSize: '24px', fill: '#fff'});
		playText.anchor.set(0.5);
		player1Lives = 3;
		player2Lives = 3;
	},
	update: function() {
		// wait for keyboard input
		if(game.input.keyboard.justPressed(Phaser.Keyboard.UP)) {
			game.state.start('Play');
		}
	}
};