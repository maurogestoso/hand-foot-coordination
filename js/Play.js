var HandFoot = HandFoot || {};

HandFoot.Play = function (game) {

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

HandFoot.Play.prototype = {

  

  create: function () {

    this.add.tileSprite(0, 0, this.world.width, this.world.height, 'lined-paper');
    
    // sprites
    this.hand = this.initPlayerPart("hand");
    this.foot = this.initPlayerPart("foot");

    this.basketballs = this.initGroup("basketball");
    this.footballs = this.initGroup("football");

    // score / chain
    this.score = 0;
    this.scoreGoal = 50;
    this.chain = {
      hand: 1,
      foot: 1
    };
    this.chainCount = {
      hand: 1,
      foot: 1
    };

    // UI
    this.add.image(0, 0, "metal-panel");
    var textStyle = { font: '18px Arial', fill: '#ffffff' };
    this.scoreLabel = this.add.text(this.world.centerX, 30, 'score: 0', textStyle);
    this.scoreLabel.anchor.setTo(0.5);

    this.chainLabel = {};
    this.chainLabel.hand = this.add.text(this.world.width/4, 60, "x1", textStyle);
    this.chainLabel.hand.anchor.setTo(0.5);
    this.chainLabel.foot = this.add.text(this.world.width*3/4, 60, "x1", textStyle);
    this.chainLabel.foot.anchor.setTo(0.5);

    // Chain bars
    this.chainBars = this.initChainBars();

    // cursor, #control
    this.cursor = this.input.keyboard.createCursorKeys();
    this.cursor.left.onDown.add(this.moveHand, this);
    this.cursor.right.onDown.add(this.moveFoot, this);

    // time / difficulty
    this.offset = 800;
    this.delay = 2200;
    this.nextItem = {};
    this.nextItem.hand = 0;
    this.nextItem.foot = this.offset;

  },

  update: function () {
    // collisions
    this.physics.arcade.overlap(this.hand, this.basketballs, this.handleOverlap, null, this);
    this.physics.arcade.overlap(this.hand, this.footballs, this.handleOverlap, null, this);
    this.physics.arcade.overlap(this.foot, this.basketballs, this.handleOverlap, null, this);
    this.physics.arcade.overlap(this.foot, this.footballs, this.handleOverlap, null, this);
    
    // create items
    this.dropItemsTimer();

  },

  // player parts

  initPlayerPart: function (key) {
    var newPart = this.add.sprite(0, 0, key);
    this.physics.arcade.enableBody(newPart);
    newPart.body.allowGravity = false;
    newPart.anchor.setTo(0.5);
    newPart.custom = {};
    if(key === "hand"){
      newPart.custom.leftPos = this.world.width*1/8;
      newPart.custom.rightPos = this.world.width*3/8;
      newPart.custom.killedBy = "football";
    }
    else if (key === "foot"){
      newPart.custom.leftPos = this.world.width*5/8;
      newPart.custom.rightPos = this.world.width*7/8;
      newPart.custom.killedBy = "basketball";
    }
    newPart.reset(newPart.custom.leftPos, this.world.height-48);
    return newPart;
  },

  moveHand: function () {
    if(this.hand.x === this.hand.custom.leftPos) this.hand.x = this.hand.custom.rightPos;
    else this.hand.x = this.hand.custom.leftPos;
  },

  moveFoot: function () {
    if(this.foot.x === this.foot.custom.leftPos) this.foot.x = this.foot.custom.rightPos;
    else this.foot.x = this.foot.custom.leftPos;
  },

  // items

  initGroup: function (key) {
    var newGroup = this.add.group();
    newGroup.enableBody = true;
    newGroup.createMultiple(10, key);
    newGroup.setAll("anchor.x", 0.5);
    newGroup.setAll("anchor.y", 0.5);
    newGroup.setAll("checkWorldBounds", true);
    newGroup.setAll("outOfBoundsKill", true);
    newGroup.setAll("allowGravity", false);

    // set onOutOfBounds listener on all items
    newGroup.forEach(function(item){
      item.events.onOutOfBounds.add(this.handleItemOutOfBounds, this);
    }, this);

    return newGroup;
  },

  dropItemsTimer: function () {
    if(this.nextItem.hand < this.time.now){
      this.dropItemOnSide("hand");
      this.nextItem.hand = this.time.now + this.delay;
    }
    if(this.nextItem.foot < this.time.now){
      this.dropItemOnSide("foot");
      this.nextItem.foot = this.time.now + this.delay;
    }
  },

  dropItemOnSide: function (key) {
    var xPos = this.rnd.pick([this[key].custom.leftPos, this[key].custom.rightPos]);
    var itemGroup = this.rnd.pick(["basketballs", "footballs"]);
    var item = this[itemGroup].getFirstExists(false, true, xPos, 16);
    item.body.velocity.y = 100;
  },

  decreaseDelay: function () {
    if(this.score >= this.scoreGoal && this.score <= 1100) {
      this.delay -= 50;
      this.scoreGoal += 50;
    }
  },

  // physics

  handleOverlap: function (playerPart, item) {
    item.kill();
    if(playerPart.custom.killedBy === item.key){
      this.damagePlayer(playerPart);
    }
    else {
      this.scorePoints(playerPart);
    }
  },

  handleItemOutOfBounds: function(item) {
    if((item.key === "basketball" &&  item.x < this.world.centerX) ||
      (item.key === "football"   &&  item.x > this.world.centerX)) {
      this.resetChain(item.key === "basketball" ? "hand" : "foot");
    }
  },

  // scoring

  scorePoints: function (playerPart) {
    this.score += this.chain[playerPart.key] * 10;
    this.scoreLabel.text = "score: " + this.score;
    this.increaseChain(playerPart.key);
    this.decreaseDelay();    
  },

  damagePlayer: function (playerPart) {
    this.resetChain(playerPart.key)
  },

  increaseChain: function(key){
    if(this.chain[key] === 4) return;

    if (this.chainCount[key] < 5) {
      this.chainCount[key]++;
      this.increaseChainBarLength(key);
    }
    else if(this.chainCount[key] === 5){
      this.chain[key]++;
      this.chainCount[key] = 1;
      if (this.chain[key] < 4) {
        this.resetChainBarLength(key);
      }
      else {
        this.increaseChainBarLength(key);
      }
      this.chainLabel[key].text = "x" + this.chain[key];
    }
  },

  resetChain: function(key){
    this.chain[key] = 1;
    this.chainCount[key] = 1;
    this.resetChainBarLength(key);
    this.chainLabel[key].text = "x1";
  },

  // UI

  initChainBars: function () {
    var hand = {}, foot = {}, dimensions = {};
    hand.left = this.add.image(this.world.width/12, this.world.height/8, 'blueBarLeft');
    hand.left.scale.setTo(1, 0.6);
    hand.mid = this.add.image(hand.left.right, hand.left.top, 'blueBarMid');
    hand.mid.scale.setTo(0, 0.6);
    hand.right = this.add.image(hand.mid.right, hand.left.top, 'blueBarRight');
    hand.right.scale.setTo(1, 0.6);

    foot.left = this.add.image(this.world.centerX + this.world.width/12, this.world.height/8, 'blueBarLeft');
    foot.left.scale.setTo(1, 0.6);
    foot.mid = this.add.image(foot.left.right, foot.left.top, 'blueBarMid');
    foot.mid.scale.setTo(0, 0.6);
    foot.right = this.add.image(foot.mid.right, foot.left.top, 'blueBarRight');
    foot.right.scale.setTo(1, 0.6);

    dimensions.maxScale = (this.world.width/2 - this.world.width/6 - 12) / 16;
    dimensions.scaleDelta = dimensions.maxScale / 5;

    return {
      hand: hand, foot: foot, dimensions: dimensions
    }

  },
  increaseChainBarLength: function (key) {
     this.chainBars[key].mid.scale.x += this.chainBars.dimensions.scaleDelta;
     this.chainBars[key].right.position.x = this.chainBars[key].mid.right;
  },
  resetChainBarLength: function (key) {
     this.chainBars[key].mid.scale.x = 0;
     this.chainBars[key].right.position.x = this.chainBars[key].mid.right;
  }
};
