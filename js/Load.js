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

		this.load.image("hand", "assets/img/hand-64.png");
		this.load.image("foot", "assets/img/foot-64.png");
		this.load.image("football", "assets/img/amanda-football-border-48.png");
		this.load.image("basketball", "assets/img/amanda-basketball-border-48.png");
		
		// UI
		this.load.image('metal-panel', 'assets/img/metalPanel.png');
		this.load.image('greenBarLeft', 'assets/img/barHorizontal_green_left.png');
		this.load.image('greenBarMid', 'assets/img/barHorizontal_green_mid.png');
		this.load.image('greenBarRight', 'assets/img/barHorizontal_green_right.png');
		this.load.image('redBarLeft', 'assets/img/barHorizontal_red_left.png');
		this.load.image('redBarMid', 'assets/img/barHorizontal_red_mid.png');
		this.load.image('redBarRight', 'assets/img/barHorizontal_red_right.png');

	},

	create: function () {

		this.state.start('Play');
	}
};
