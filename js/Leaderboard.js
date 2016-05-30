var HandFoot = HandFoot || {};

HandFoot.Leaderboard = function (game) {

};

HandFoot.Leaderboard.prototype = {

  init: function (newScore) {
    this.newScore = newScore;
    
  },

  create: function () {

    this.add.tileSprite(0, 0, this.world.width, this.world.height, 'lined-paper');

    

    var cursor = this.input.keyboard.createCursorKeys();
    // cursor.left.onDown.add(this.toLeaderboard, this)
    cursor.right.onDown.add(this.backToMenu, this)

  },

  backToMenu: function () {
    this.state.start('Menu');
  },

  
};
