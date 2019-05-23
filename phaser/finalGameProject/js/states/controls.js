// Control state

var Controls = function(game) {};
Controls.prototype = {
	create: function() {
		// add title screen text
		/*var titleText = game.add.text(game.width/2, game.height*.2, 'final Game Project', {font: 'Helvetica', fontSize: '48px', fill: '#fff'});
		titleText.anchor.set(0.5);

		var instructText = game.add.text(game.width/2, game.height*.3, 'By Group 50\nDerek Jean, David Monroe, Kyle Fegan', {font: 'Helvetica', fontSize: '24px', fill: '#fff'});
		instructText.anchor.set(0.5);*/

		var playText = game.add.text(game.width/2, game.height*.3, '2 player versus. Fast moving balls kill players. Last one standing wins.', {font: 'Helvetica', fontSize: '24px', fill: '#fff'});
		playText.anchor.set(0.5);

		var playText = game.add.text(game.width/2, game.height*.4, 'P1 = arrows keys to move, numpad 0 knocks balls\nP2 = awd keys to move, left shift knocks balls\n Press r to end, can restart after ending', {font: 'Helvetica', fontSize: '24px', fill: '#fff'});
		playText.anchor.set(0.5);

		// creates play button
		var playButton = game.add.button(game.width/2, game.height*.7, 'playbutton', this.goPlay, this,1, 0, 2);
		playButton.anchor.set(0.5);

	},
	update: function() {
	},
	goPlay: function() {
		//clear world: true, clear cache: false, freshStart: true, playerOneLives: 0 (will be overwritten), playerTwoLives: 0 (will be overwritten)
		//game.time.events.add(Phaser.Timer.SECOND * 2, function() {
			game.state.start('Play', true, false, true, 0, 0);
		//});
	}
};