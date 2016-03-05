var HandFoot = {};

HandFoot.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

    this.hand;
    this.foot;
    this.cursors;

};

HandFoot.Game.prototype = {

  preload: function() {
    this.load.spritesheet("hand", "assets/img/hand-sheet.png", 64, 64, 3, 2, 2);
    this.load.spritesheet("foot", "assets/img/foot-sheet.png", 64, 64, 3, 2, 2);
  },

  create: function () {

    this.stage.backgroundColor = "#1166ff";

    this.hand = this.add.sprite(this.world.width/8, this.world.height-50, "hand");
    this.hand.anchor.setTo(0.5);
    this.hand.leftPosition = this.world.width*1/8;
    this.hand.rightPosition = this.world.width*3/8;

    this.foot = this.add.sprite(this.world.width*5/8, this.world.height-50, "foot");
    this.foot.anchor.setTo(0.5);
    this.foot.leftPosition = this.world.width*5/8;
    this.foot.rightPosition = this.world.width*7/8;

    this.setupMotion();


  },

  update: function () {


  },

  setupMotion: function(){
    this.cursors = this.input.keyboard.createCursorKeys();


    ////// LEFT KEY
    this.cursors.left.onDown.add(function(){
      console.log("Left pressed!");
      if(this.hand.x === this.hand.leftPosition){
        this.hand.x = this.hand.rightPosition;
      }
      else {
        this.hand.x = this.hand.leftPosition;
      }
    }, this);

    ////// RIGHT KEY
    this.cursors.right.onDown.add(function(){
      console.log("Right pressed!");
      if(this.foot.x === this.foot.leftPosition){
        this.foot.x = this.foot.rightPosition;
      }
      else {
        this.foot.x = this.foot.leftPosition;
      }
    }, this);
  }


};
