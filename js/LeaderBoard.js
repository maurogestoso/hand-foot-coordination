var HandFoot = HandFoot || {};

HandFoot.Leaderboard = function (game) {

};

HandFoot.Leaderboard.prototype = {

  init: function (score, name) {
    var hiScores = JSON.parse(window.localStorage.getItem('hiScores'));
    for (var i = 0; i < hiScores.length; i++) {
      if(score > hiScores[i].score){
        break;
      }
    }
    this.newScoreIndex = i;
    this.newHiScores = [];
    this.newHiScores = this.newHiScores.concat(hiScores.slice(0, i));
    this.newHiScores = this.newHiScores.concat({name: name, score: score});
    this.newHiScores = this.newHiScores.concat(hiScores.slice(i, -1));
    window.localStorage.setItem('hiScores', JSON.stringify(this.newHiScores));
  },

  create: function () {

    this.add.tileSprite(0, 0, this.world.width, this.world.height, 'lined-paper');

    // HI-SCORES
    var textStyle = { 'font': '48px Pixel', fill: 'darkblue', 'align': 'center' };
    var scoreLabel = this.add.text(this.world.centerX, 20, "Hi-Scores", textStyle);
    scoreLabel.anchor.setTo(0.5, 0);

    // SCORES
    textStyle = { 'font': '30px Pixel', fill: 'darkblue', 'align': 'center' };
    var currHiScoreLabel;
    for (var i = 0; i < this.newHiScores.length; i++) {
      currHiScoreLabel = this.add.text(
        this.world.centerX, 100 + 25 * i,
        this.newHiScores[i].name + " .................................... " + this.newHiScores[i].score,
        textStyle
      );
      currHiScoreLabel.anchor.setTo(0.5);
      if (i === this.newScoreIndex) {
        currHiScoreLabel.fill = 'red';
      }
    }

    // TO MENU
    var foot = this.add.image(this.world.width/5, this.world.height-30, 'foot');
    foot.anchor.setTo(0.5);
    this.add.tween(foot)
      .to({angle: -4}, 400).to({angle: 4}, 800).to({angle: 0}, 400)
      .loop().start();
    textStyle = { 'font': '32px Pixel', fill: 'darkblue' };
    var continueLabel = this.add.text(foot.right + 20, foot.position.y, "back to Main Menu", textStyle);
    continueLabel.anchor.setTo(0, 0.5);

    var cursor = this.input.keyboard.createCursorKeys();
    cursor.right.onDown.add(this.backToMenu, this)

  },

  backToMenu: function () {
    this.state.start('Menu');
  }
};
