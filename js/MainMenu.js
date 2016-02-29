
BasicGame.MainMenu = function (game) {};

BasicGame.MainMenu.prototype = {

	create: function () {

	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	startGame: function (pointer) {

		//	And start the actual game
		this.state.start('Game');

	}

};
