var HandFoot = HandFoot || {};

HandFoot.GameOver = function (game) {

};

HandFoot.GameOver.prototype = {
  
  init: function (newScore) {
    this.newScore = newScore;
    var defaultHiScores = [
      {name: 'AAA', score: 9999},
      {name: 'MAU', score: 7500},
      {name: 'MRF', score: 5000},
      {name: 'MIC', score: 2000},
      {name: 'LUC', score: 1500},
      {name: 'GMI', score: 1000},
      {name: 'MAE', score: 750},
      {name: 'TOB', score: 500},
      {name: 'BUS', score: 200},
      {name: 'GOB', score: 100}
    ];
    window.localStorage.setItem('hiScores', window.localStorage.getItem('hiScores') || JSON.stringify(defaultHiScores));
    this.isHiScore = this.checkNewHighScore(newScore, window.localStorage.getItem('hiScores'));
    console.log('New score: ' + newScore);
    console.log('Is hiScore? ' + this.isHiScore);
  },

  create: function () {

    this.add.tileSprite(0, 0, this.world.width, this.world.height, 'lined-paper');

    // GAME OVER
    var textStyle = { 'font': '64px Pixel', fill: 'darkblue', 'align': 'center' };
    var gameOverLabel = this.add.text(this.world.centerX, this.world.height/5, "Game\nOver :(", textStyle);
    gameOverLabel.anchor.setTo(0.5);

    // SCORE
    textStyle = { 'font': '48px Pixel', fill: 'darkblue', 'align': 'center' };
    var scoreLabel = this.add.text(this.world.centerX, this.world.centerY, "Your score:\n" + this.newScore, textStyle);
    scoreLabel.anchor.setTo(0.5);

    // NEW HIGH
    var newHigh;
    if(this.isHiScore){
      textStyle = { 'font': '32px Pixel', fill: 'red', 'align': 'center' };
      newHighLabel = this.add.text(scoreLabel.position.x + 90, scoreLabel.position.y+20, 'New high!', textStyle);
      newHighLabel.anchor.setTo(0.5);
      this.add.tween(newHighLabel)
        .to({alpha: 0}, 250).to({alpha: 1}, 250)
        .loop().start();

      // TO LEADERBOARD
      var hand = this.add.image(this.world.width/6, this.world.height*4/6, 'hand');
      hand.anchor.setTo(0.5);
      this.add.tween(hand)
        .to({angle: 4}, 400).to({angle: -4}, 800).to({angle: 0}, 400)
        .loop().start();
      textStyle = { 'font': '32px Pixel', fill: 'darkblue' };
      var toLeaderboardLabel = this.add.text(hand.right + 20, hand.position.y, "to save your score", textStyle);
      toLeaderboardLabel.anchor.setTo(0, 0.5);
    }

    // TO MENU
    var foot = this.add.image(this.world.width/6, this.world.height*5/6, 'foot');
    foot.anchor.setTo(0.5);
    this.add.tween(foot)
      .to({angle: -4}, 400).to({angle: 4}, 800).to({angle: 0}, 400)
      .loop().start();
    textStyle = { 'font': '32px Pixel', fill: 'darkblue' };
    var backToMenuLabel = this.add.text(foot.right + 20, foot.position.y, "back to Main Menu", textStyle);
    backToMenuLabel.anchor.setTo(0, 0.5);

    // CONTROLS
    var cursor = this.input.keyboard.createCursorKeys();
    cursor.left.onDown.add(this.toLeaderboard, this);
    cursor.right.onDown.add(this.backToMenu, this);

  },

  backToMenu: function () {
    this.state.start('Menu');
  },
  
  toLeaderboard: function () {
    this.state.start('Leaderboard', true, false, this.newScore);
  },

  checkNewHighScore: function (score, hiScoresJSON) {
    var hiScores = JSON.parse(hiScoresJSON);
    return hiScores.reduce(function (isHigh, highScore, index) {
      if(score > highScore.score) {
        return true;
      }
      return false;
    }, false);
  }
};
