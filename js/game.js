window.onload = function() {

	var game = new Phaser.Game(300, 600, Phaser.AUTO, 'gameContainer');

	game.state.add('Boot', HandFoot.Boot);
	game.state.add('Load', HandFoot.Load);
	game.state.add('Menu', HandFoot.Menu);
	game.state.add('Play', HandFoot.Play);
	game.state.add('GameOver', HandFoot.GameOver);

	game.state.start('Boot');

};
