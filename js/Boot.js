var HandFoot = HandFoot || {};

HandFoot.Boot = function (game) {

};

HandFoot.Boot.prototype = {
	preload: function () {
		this.load.image("orange-block", "assets/img/orange-block.png");
		this.load.image("lined-paper", "assets/img/lined-paper.png");
	},
	create: function () {
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;

		this.add.tileSprite(0, 0, this.world.width, this.world.height, 'lined-paper');
		
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.physics.arcade.gravity.y = 0;

		this.state.start('Load');
	}
};
