var BasicGame = {};

BasicGame.Boot = function (game) {};

BasicGame.Boot.prototype = {
  create: function () {
    this.state.start('Preloader');

  }
};
