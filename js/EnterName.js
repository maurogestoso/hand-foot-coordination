var HandFoot = HandFoot || {};

HandFoot.EnterName = function (game) {

};

HandFoot.EnterName.prototype = {

  init: function (newScore) {
    this.currState = {
      newScore: newScore,
      nameArray: ['A', '_', '_'],
      namePosition: 0,
      charCounter: 0
    }
  },

  create: function () {

    this.add.tileSprite(0, 0, this.world.width, this.world.height, 'lined-paper');

    // SCORE
    var textStyle = { 'font': '48px Pixel', fill: 'darkblue', 'align': 'center' };
    var scoreLabel = this.add.text(this.world.centerX, this.world.height/8, "Your score:\n" + this.currState.newScore, textStyle);
    scoreLabel.anchor.setTo(0.5);

    textStyle = { 'font': '40px Pixel', fill: 'darkblue', 'align': 'center' };
    var enterNameLabel = this.add.text(this.world.centerX, this.world.height*1/4, "Enter your name:", textStyle);
    enterNameLabel.anchor.setTo(0.5);

    var playerNameStr = this.currState.nameArray.join(' ');
    textStyle = { 'font': '64px Pixel', fill: 'darkblue' };
    this.playerNameLabel = this.add.text(this.world.centerX, this.world.height*3/8, playerNameStr, textStyle);
    this.playerNameLabel.anchor.setTo(0.5);

    // NEXT LETTER
    var hand = this.add.image(this.world.width/6, this.world.height*4/6, 'hand');
    hand.anchor.setTo(0.5);
    this.add.tween(hand)
      .to({angle: 4}, 400).to({angle: -4}, 800).to({angle: 0}, 400)
      .loop().start();
    textStyle = { 'font': '32px Pixel', fill: 'darkblue' };
    var nextLetterLabel = this.add.text(hand.right + 20, hand.position.y, "to change letter", textStyle);
    nextLetterLabel.anchor.setTo(0, 0.5);

    // CONTINUE
    var foot = this.add.image(this.world.width/6, this.world.height*5/6, 'foot');
    foot.anchor.setTo(0.5);
    this.add.tween(foot)
      .to({angle: -4}, 400).to({angle: 4}, 800).to({angle: 0}, 400)
      .loop().start();
    textStyle = { 'font': '32px Pixel', fill: 'darkblue' };
    var continueLabel = this.add.text(foot.right + 20, foot.position.y, "to select letter", textStyle);
    continueLabel.anchor.setTo(0, 0.5);

    var cursor = this.input.keyboard.createCursorKeys();
    cursor.left.onDown.add(this.changeLetter, this)
    cursor.right.onDown.add(this.selectLetter, this)

  },

  selectLetter: function () {
    if(this.currState.namePosition === 2) {
      this.toLeaderboard();
    } else {
      this.currState.namePosition++;
      this.currState.charCounter = 0;
      this.currState.nameArray[this.currState.namePosition] = 'A';
      var nameStr = this.currState.nameArray.join(" ");
      this.playerNameLabel.text = nameStr;
    }
  },

  changeLetter: function () {
    var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');
    if(this.currState.charCounter === 35){
      this.currState.charCounter = 0;
    } else {
      this.currState.charCounter++;
    }
    this.currState.nameArray[this.currState.namePosition] = alphabet[this.currState.charCounter];
    var nameStr = this.currState.nameArray.join(" ");
    this.playerNameLabel.text = nameStr;
  },

  toLeaderboard: function () {
    this.state.start('Leaderboard', true, false, this.currState.newScore, this.currState.nameArray.join(""));
  },

  
};
