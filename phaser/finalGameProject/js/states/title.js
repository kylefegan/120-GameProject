// Title state

var Title = function(game) {};
Title.prototype = {
	create: function() {
		// add title screen text
		var titleText = game.add.text(game.width/2, game.height/2, 'final Game Project', {font: 'Helvetica', fontSize: '48px', fill: '#fff'});
		titleText.anchor.set(0.5);

		var instructText = game.add.text(game.width/2, game.height/2 + 48, 'By Group 50', {font: 'Helvetica', fontSize: '24px', fill: '#fff'});
		instructText.anchor.set(0.5);

		var playText = game.add.text(game.width/2, game.height*.8, 'P1 = arrows, P2 = awd, down arrow to end.', {font: 'Helvetica', fontSize: '24px', fill: '#fff'});
		playText.anchor.set(0.5);

	},
	update: function() {
		// check for UP input
		if(game.input.keyboard.justPressed(Phaser.Keyboard.UP)) {
			game.state.start('Play');
		}
	}
};