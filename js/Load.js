var HandFoot = HandFoot || {};

HandFoot.Load = function (game) {

};

HandFoot.Load.prototype = {
	preload: function() {
		var loadingLabel = this.add.text(this.world.width/2, 150,
			'loading...', { font: '30px Arial', fill: '#ffffff' });
		loadingLabel.anchor.setTo(0.5, 0.5);
		// Display the progress bar
		var progressBar = this.add.sprite(this.world.width/2, 200, 'orange-block');
		progressBar.anchor.setTo(0.5, 0.5);
		progressBar.scale.setTo(1, 2);
		this.load.setPreloadSprite(progressBar);

		// TODO hand and foot sprites are too big, maybe 48x48
		this.load.spritesheet("hand", "assets/img/hand-sheet.png", 64, 64, 3, 2, 2);
		this.load.spritesheet("foot", "assets/img/foot-sheet.png", 64, 64, 3, 2, 2);
		this.load.image("football", "assets/img/football.png");
		this.load.image("basketball", "assets/img/basketball.png");
		this.load.image("top-panel", "assets/img/top-panel.png");
	},

	create: function () {

		this.state.start('Play');
	}
};
