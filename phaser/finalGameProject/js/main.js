"use strict"

var game;
var canJump;

window.onload = function() {
	game = new Phaser.Game(1000,800, Phaser.AUTO, 'myGame');
	
	// define states
	game.state.add('Load', Load);
	game.state.add('Title', Title);
	game.state.add('Play', Play);
	game.state.add('GameOver', GameOver);
	game.state.start('Load');
}