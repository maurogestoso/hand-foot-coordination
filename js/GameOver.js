var HandFoot = HandFoot || {};

HandFoot.GameOver = function (game) {

};

HandFoot.GameOver.prototype = {

  init: function () {
    var highScores = [{name: 'AAA', score: 9999}, {name: 'MAU', score: 8888}];
    window.localStorage.setItem('highScores', window.localStorage.getItem('highScores') || JSON.stringify(highScores));
  },

  create: function () {

    this.add.tileSprite(0, 0, this.world.width, this.world.height, 'lined-paper');

    var textStyle = { 'font': '64px Pixel', fill: 'darkblue', 'text-align': 'center' };
    var gameOverLabel = this.add.text(this.world.centerX, this.world.height/5, "Game\nOver :(", textStyle);
    gameOverLabel.anchor.setTo(0.5);

    var hand = this.add.image(this.world.width/6, this.world.height*2/4, 'hand');
    hand.anchor.setTo(0.5);
    this.add.tween(hand)
      .to({angle: 4}, 400)
      .to({angle: -4}, 800)
      .to({angle: 0}, 400)
      .loop()
      .start();
    var foot = this.add.image(hand.position.x, this.world.height*3/4, 'foot');
    foot.anchor.setTo(0.5);
    this.add.tween(foot)
      .to({angle: -4}, 400)
      .to({angle: 4}, 800)
      .to({angle: 0}, 400)
      .loop()
      .start();

    textStyle = { 'font': '32px Pixel', fill: 'darkblue' };
    var toLeaderboardLabel = this.add.text(hand.right + 20, hand.position.y, "to Leaderboard", textStyle);
    toLeaderboardLabel.anchor.setTo(0, 0.5);
    var backToMenuLabel = this.add.text(foot.right + 20, foot.position.y, "back to Main Menu", textStyle);
    backToMenuLabel.anchor.setTo(0, 0.5);

    var cursor = this.input.keyboard.createCursorKeys();
    cursor.right.onDown.add(this.backToMenu, this)

  },

  backToMenu: function () {
    this.state.start('Menu');
  }
};
