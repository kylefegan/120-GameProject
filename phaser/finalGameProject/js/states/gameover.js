// Game Over state

var GameOver = function(game) {};
GameOver.prototype = {
	init: function(playerOneLives, playerTwoLives) {
		this.p1Lives = playerOneLives;
		this.p2Lives = playerTwoLives;
	},

	create: function() {
		if (this.p1Lives == 0) {
			var EndScreen = game.add.sprite(0,0, 'End2');
			/*var playText = game.add.text(game.width/2, game.height*.4, 'Player 2 Wins', {font: 'Helvetica', fontSize: '48px', fill: '#fff'});
			playText.anchor.set(0.5);*/
			var playText = game.add.text(game.width*.27, game.height*.15, 'Press R to Restart', {font: 'Palatino', fontSize: '24px', fill: '#000'});
		} else {
			var EndScreen = game.add.sprite(0,0, 'End1');
			/*var playText = game.add.text(game.width/2, game.height*.4, 'Player 1 Wins', {font: 'Helvetica', fontSize: '48px', fill: '#fff'});
			playText.anchor.set(0.5);*/
			var playText = game.add.text(game.width*.8, game.height*.2, 'Press R to Restart', {font: 'Palatino', fontSize: '24px', fill: '#000'});
		}
		playText.anchor.set(0.5);
	},

	update: function() {
		// wait for keyboard input
		if(game.input.keyboard.justPressed(Phaser.Keyboard.R)) {
			//clear world: true, clear cache: false, freshStart: true, playerOneLives: 0 (will be overwritten), playerTwoLives: 0 (will be overwritten)
			game.state.start('Play', true, false, true, 0, 0);
		}
	}
};