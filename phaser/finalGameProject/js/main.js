//This version was primarily written by only two of three group members due to
//a case of excused medical leave, so progress is limited.

//Group 50 members: Derek Jean,David Monroe, Kyle Fegan

//GitHub repo:  https://github.com/kylefegan/120-GameProject

"use strict"

var game;
var playButton;
var contolButton;

window.onload = function() {
	game = new Phaser.Game(1000,800, Phaser.AUTO, 'myGame');
	
	// define states
	game.state.add('Load', Load);
	game.state.add('Title', Title);
	game.state.add('Controls', Controls);
	game.state.add('Play', Play);
	game.state.add('GameOver', GameOver);
	game.state.start('Load');
}