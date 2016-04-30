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

  init: function(){
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;

    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.physics.arcade.gravity.y = 0;
  },

  preload: function() {
    // TODO hand and foot sprites are too big, maybe 48x48
    this.load.spritesheet("hand", "assets/img/hand-sheet.png", 64, 64, 3, 2, 2);
    this.load.spritesheet("foot", "assets/img/foot-sheet.png", 64, 64, 3, 2, 2);
    this.load.image("football", "assets/img/football.png");
    this.load.image("basketball", "assets/img/basketball.png");
    this.load.image("top-panel", "assets/img/top-panel.png");
  },

  create: function () {

    this.stage.backgroundColor = "79bd9a";
    
    // sprites
    this.hand = this.initPlayerPart("hand");
    this.foot = this.initPlayerPart("foot");

    this.basketballs = this.initGroup("basketball");
    this.footballs = this.initGroup("football");
    
    // UI
    this.add.image(0, 0, "top-panel");

    // cursor, #control
    this.cursor = this.input.keyboard.createCursorKeys();
    this.cursor.left.onDown.add(this.moveHand, this);
    this.cursor.right.onDown.add(this.moveFoot, this);

    // time / difficulty
    this.offset = 800;
    this.delay = 2200;
    this.nextHandItem = 0;
    this.nextFootItem = this.offset;

  },

  update: function () {
    // collisions
    this.physics.arcade.overlap(this.hand, this.basketballs, this.scorePoints, null, this);
    this.physics.arcade.overlap(this.hand, this.footballs, this.damagePlayer, null, this);
    this.physics.arcade.overlap(this.foot, this.basketballs, this.damagePlayer, null, this);
    this.physics.arcade.overlap(this.foot, this.footballs, this.scorePoints, null, this);
    
    // create items
    this.dropItemsTimer();

  },
  
  initPlayerPart: function(key){
    var newPart = this.add.sprite(0, 0, key);
    this.physics.arcade.enableBody(newPart);
    newPart.body.allowGravity = false;
    newPart.anchor.setTo(0.5);
    newPart.custom = {};
    if(key === "hand"){
      newPart.custom.leftPos = this.world.width*1/8;
      newPart.custom.rightPos = this.world.width*3/8;
    }
    else if (key === "foot"){
      newPart.custom.leftPos = this.world.width*5/8;
      newPart.custom.rightPos = this.world.width*7/8;
    }
    newPart.reset(newPart.custom.leftPos, this.world.height-32);
    return newPart;
  },

  moveHand: function(){
    if(this.hand.x === this.hand.custom.leftPos) this.hand.x = this.hand.custom.rightPos;
    else this.hand.x = this.hand.custom.leftPos;
  },

  moveFoot: function(){
    if(this.foot.x === this.foot.custom.leftPos) this.foot.x = this.foot.custom.rightPos;
    else this.foot.x = this.foot.custom.leftPos;
  },
  
  //TODO refactor into handleCollision
  scorePoints: function(player, item){
    // player is either this.hand or this.foot
    // item is either a member of basketballs or footballs
    item.kill();
    console.log("Score points!");
  },

  damagePlayer: function(player, item){
    // player is either this.hand or this.foot
    // item is either a member of basketballs or footballs
    item.kill();
    console.log("Ouch!");
  },

  dropItemOnSide: function(key){
    var xPos = this.rnd.pick([this[key].custom.leftPos, this[key].custom.rightPos]);
    var itemGroup = this.rnd.pick(["basketballs", "footballs"]);
    var item = this[itemGroup].getFirstExists(false, true, xPos, 16);
    console.log(item);
    item.body.velocity.y = 100;
  },

  initGroup: function(key){
    var newGroup = this.add.group();
    newGroup.enableBody = true;
    newGroup.createMultiple(10, key);
    newGroup.setAll("anchor.x", 0.5);
    newGroup.setAll("anchor.y", 0.5);
    newGroup.setAll("checkWorldBounds", true);
    newGroup.setAll("outOfBoundsKill", true);
    newGroup.setAll("allowGravity", false);
    return newGroup;
  },
  
  dropItemsTimer: function(){
    if(this.nextHandItem < this.time.now){
      console.log("new hand item!");
      this.dropItemOnSide("hand");
      this.nextHandItem = this.time.now + this.delay;
    }
    if(this.nextFootItem < this.time.now){
      console.log("new foot item!");
      this.dropItemOnSide("foot");
      this.nextFootItem = this.time.now + this.delay;
    }
  }
};
