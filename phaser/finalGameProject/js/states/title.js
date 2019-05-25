// Title state

var Title = function(game) {};
Title.prototype = {
	create: function() {
		// add title screen text
		var titleText = game.add.text(game.width/2, game.height*.2, 'final Game Project', {font: 'Helvetica', fontSize: '48px', fill: '#fff'});
		titleText.anchor.set(0.5);

		var instructText = game.add.text(game.width/2, game.height*.3, 'By Group 50\nDerek Jean, David Monroe, Kyle Fegan', {font: 'Helvetica', fontSize: '24px', fill: '#fff'});
		instructText.anchor.set(0.5);
		// creates play button with sounds when the cursor is hovering and pressed down the button
		playButton = game.add.button(game.width/2, game.height*.6, 'playbutton', this.goPlay, this,1, 0, 2);
		playButton.anchor.set(0.5);
		playButton.onOverSound = game.add.audio('buttonHover');
		playButton.onDownSound = game.add.audio('buttonDown');
		// creates control button with sounds when the cursor is hovering and pressed down the button
		controlButton = game.add.button(game.width/2, game.height*.8, 'controlbutton', this.goControl, this,1, 0, 2);
		controlButton.anchor.set(0.5);
		controlButton.onOverSound = game.add.audio('buttonHover');
		controlButton.onDownSound = game.add.audio('buttonDown');
	},
	update: function() {
	},
	goPlay: function() {
		// makes button stay on down frame when pressed
		playButton.freezeFrames = true;

		// spawns an animation fading to white
		transition = game.add.sprite(0, 0, 'screenTransition', 0);
		transition.scale.x = 4;
		transition.scale.y = 4;
		transition.animations.add('fade', [0,1,2,3,4,5,6,7,8,9], 8);
		transition.animations.play('fade');

		// goes to next game state after 1.5 seconds
		game.time.events.add(Phaser.Timer.SECOND * 1.5, function() {
			//clear world: true, clear cache: false, freshStart: true, playerOneLives: 0 (will be overwritten), playerTwoLives: 0 (will be overwritten)
			game.state.start('Play', true, false, true, 0, 0);
		});
	},
	goControl: function() {
		// makes button stay on down frame when pressed
		controlButton.freezeFrames = true;

		// spawns an animation fading to white
		transition = game.add.sprite(0, 0, 'screenTransition', 0);
		transition.scale.x = 4;
		transition.scale.y = 4;
		transition.animations.add('fade', [0,1,2,3,4,5,6,7,8,9], 8);
		transition.animations.play('fade');

		// goes to next game state after 1.5 seconds
		game.time.events.add(Phaser.Timer.SECOND * 1.5, function() {
			game.state.start('Controls');
		});
	}
};