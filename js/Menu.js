var HandFoot = HandFoot || {};

HandFoot.Menu = function (game) {};

HandFoot.Menu.prototype = {

  create: function () {

    this.add.tileSprite(0, 0, this.world.width, this.world.height, 'lined-paper');

    var title = this.add.image(this.world.centerX, -this.world.centerY, 'title');
    title.anchor.setTo(0.5);
    this.add.tween(title)
      .to({y: this.world.height/3}, 2000)
      .easing(Phaser.Easing.Bounce.Out)
      .start();

    var foot = this.add.image(this.world.width/3, this.world.height*3/4, 'foot');
    foot.anchor.setTo(0.5);
    this.add.tween(foot)
      .to({angle: -4}, 400)
      .to({angle: 4}, 800)
      .to({angle: 0}, 400)
      .loop()
      .start();

    var textStyle = { 'font': '36px Pixel', fill: 'darkblue' };
    var startLabel = this.add.text(foot.right + 20, this.world.height*3/4, "to start", textStyle);
    startLabel.anchor.setTo(0, 0.5);

    textStyle = { 'font': '18px Pixel', fill: 'darkblue' };
    var creditsLabel = this.add.text(this.world.width - 10, this.world.height-10,
      "An awkward game by Mauro Gestoso - 2016",
      textStyle);
    creditsLabel.anchor.setTo(1, 1);

    var cursor = this.input.keyboard.createCursorKeys();
    cursor.right.onDown.add(this.startGame, this)

  },

  startGame: function () {
    this.state.start('GameOver');
  }
};
