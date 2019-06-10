// Game Over state

var GameOver = function(game) {};
GameOver.prototype = {
	init: function(playerOneLives, playerTwoLives) {
		this.p1Lives = playerOneLives;
		this.p2Lives = playerTwoLives;
		this.cheering = game.add.audio('crowd');
	},

	create: function() {
		if (this.p1Lives == 0) {
			//Player 2 Wins!!!
			var EndScreen = game.add.sprite(0,0, 'End2');
			var winner = game.add.sprite(680, 150, 'victory2', 1);
			winner.animations.add('idle', [0,1], 3, true);
			winner.animations.play('idle');
			var loser = game.add.sprite(200, 330, 'victory1', 1);
			loser.animations.add('idle', [0,1], 3, true);
			loser.animations.play('idle');
			
			/*var playText = game.add.text(game.width/2, game.height*.4, 'Player 2 Wins', {font: 'Helvetica', fontSize: '48px', fill: '#fff'});
			playText.anchor.set(0.5);*/
			var playText = game.add.text(game.width*.27, game.height*.15, 'Press R to Restart', {font: 'Palatino', fontSize: '24px', fill: '#000'});
		} else {
			//Player 1 Wins!!!
			var EndScreen = game.add.sprite(0,0, 'End1');
			var winner = game.add.sprite(200, 150, 'victory1', 1);
			winner.animations.add('idle', [0,1], 3, true);
			winner.animations.play('idle');
			var loser = game.add.sprite(680, 330, 'victory2', 1);
			loser.animations.add('idle', [0,1], 3, true);
			loser.animations.play('idle');
			
			/*var playText = game.add.text(game.width/2, game.height*.4, 'Player 1 Wins', {font: 'Helvetica', fontSize: '48px', fill: '#fff'});
			playText.anchor.set(0.5);*/
			var playText = game.add.text(game.width*.8, game.height*.2, 'Press R to Restart', {font: 'Palatino', fontSize: '24px', fill: '#000'});
		}
		playText.anchor.set(0.5);
		this.cheering.play();
	},

	update: function() {
		// wait for keyboard input
		if(game.input.keyboard.justPressed(Phaser.Keyboard.R)) {
			this.cheering.stop();
			//clear world: true, clear cache: false, freshStart: true, playerOneLives: 0 (will be overwritten), playerTwoLives: 0 (will be overwritten)
			game.state.start('Play', true, false, true, 0, 0);
		}
	}
};