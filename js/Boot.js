var HandFoot = HandFoot || {};

HandFoot.Boot = function (game) {

};

HandFoot.Boot.prototype = {
	preload: function () {
		this.load.image("orange-block", "assets/img/orange-block.png");
	},
	create: function () {
		this.stage.backgroundColor = "79bd9a";
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;

		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.physics.arcade.gravity.y = 0;

		this.state.start('Load');
	}
};
