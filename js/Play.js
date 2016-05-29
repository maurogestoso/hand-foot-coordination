var HandFoot = HandFoot || {};

HandFoot.Play = function (game) {};

HandFoot.Play.prototype = {

  create: function () {
    
    // background
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
    var textStyle;
    this.add.image(0, 0, "metal-panel");
    textStyle = { 'font': '24px Pixel', fill: 'black' };
    this.scoreLabel = this.add.text(this.world.centerX, this.world.height/10, 'score: 0', textStyle);
    this.scoreLabel.anchor.setTo(0.5);

    this.chainLabel = {};
    textStyle = { 'font': '36px Pixel', fill: 'black' };
    this.chainLabel.hand = this.add.text(this.world.width/12, 60, "x1", textStyle);
    this.chainLabel.hand.anchor.setTo(0, 0.5);
    this.chainLabel.foot = this.add.text(this.world.width*11/12, 60, "x1", textStyle);
    this.chainLabel.foot.anchor.setTo(1, 0.5);

    // Health bar
    this.health = 100;
    this.healthBar = this.initHealthBar();

    // Chain bars
    this.chainBars = this.initChainBars();

    // cursor, #control
    this.cursor = this.initControls();

    // time / difficulty
    this.difficulty = this.setupDifficulty();
    this.time.events.loop(this.difficulty.increaseTick * 1000, this.increaseDifficulty, this);
    this.nextItem = {
      hand: 0,
      foot: this.difficulty.itemOffset
    };

    // sound
    this.sound = this.initSounds();
    this.sound.music.loop = true;
    this.sound.music.play();

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

  ////////////////////////////////////////////////////
  /////////////// SPRITES
  ////////////////////////////////////////////////////

  initPlayerPart: function (key) {
    /*
     * called @ create
     * */

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
  initGroup: function (key) {
    /*
     * called @ create
     * */
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

  ////////////////////////////////////////////////////
  //////////// DIFFICULTY
  ////////////////////////////////////////////////////

  dropItemsTimer: function () {
    /*
     * called @ update
     */
    if(this.nextItem.hand < this.time.now){
      this.dropItemOnSide("hand");
      this.nextItem.hand = this.time.now + this.difficulty.itemDelay;
    }
    if(this.nextItem.foot < this.time.now){
      this.dropItemOnSide("foot");
      this.nextItem.foot = this.time.now + this.difficulty.itemDelay;
    }
  },
  dropItemOnSide: function (key) {
    /*
     * called by dropItemsTimer
     */
    var xPos = this.rnd.pick([this[key].custom.leftPos, this[key].custom.rightPos]);
    var itemGroup = this.rnd.pick(["basketballs", "footballs"]);
    var item = this[itemGroup].getFirstDead(true, xPos, 16);
    item.body.velocity.y = this.difficulty.itemSpeed;
  },
  setupDifficulty: function() {
    var difficulty = {};
    // difficulty.gameDuration = 120;
    difficulty.increaseTick = 3;

    difficulty.minItemSpeed = 100;
    // difficulty.maxItemSpeed = 400;
    difficulty.itemSpeed = difficulty.minItemSpeed;
    // difficulty.speedDelta = (difficulty.maxItemSpeed - difficulty.minItemSpeed) / (difficulty.gameDuration / difficulty.increaseTick);
    difficulty.speedDelta = 5;

    difficulty.maxItemDelay = 2000;
    // difficulty.minItemDelay = 600;
    difficulty.itemDelay = difficulty.maxItemDelay;
    // difficulty.delayDelta = (difficulty.maxItemDelay - difficulty.minItemDelay) / (difficulty.gameDuration / difficulty.increaseTick);
    difficulty.delayDelta = 35;

    difficulty.itemOffset = 800;

    return difficulty;
  },
  increaseDifficulty: function () {
    this.difficulty.itemSpeed += this.difficulty.speedDelta;
    this.difficulty.itemDelay -= this.difficulty.delayDelta;
  },

  ////////////////////////////////////////////////////
  /////////////// CONTROLS
  ////////////////////////////////////////////////////

  initControls: function () {
    var cursor = this.input.keyboard.createCursorKeys();
    cursor.left.onDown.add(this.moveHand, this);
    cursor.right.onDown.add(this.moveFoot, this);
    return cursor;
  },
  moveHand: function () {
    /*
     * called by event setup @ create
     */
    if(this.hand.x === this.hand.custom.leftPos) this.hand.x = this.hand.custom.rightPos;
    else this.hand.x = this.hand.custom.leftPos;
  },
  moveFoot: function () {
    /*
     * called by event setup @ create
     */
    if(this.foot.x === this.foot.custom.leftPos) this.foot.x = this.foot.custom.rightPos;
    else this.foot.x = this.foot.custom.leftPos;
  },

  ////////////////////////////////////////////////////
  ///////////// PHYSICS
  ////////////////////////////////////////////////////

  handleOverlap: function (playerPart, item) {
    /*
    * called by this.physics.arcade.overlap @ update
    * */

    item.kill();
    if(playerPart.custom.killedBy === item.key){
      this.damagePlayer(playerPart);
      this.sound.bad.play();
      this.grabBadItemTween(playerPart);
    }
    else {
      this.scorePoints(playerPart);
      this.sound.good.play();
      this.grabGoodItemTween(playerPart);
    }
  },
  handleItemOutOfBounds: function(item) {
    /*
     * called by event setup @ initGroup
     * */
    if((item.key === "basketball" &&  item.x < this.world.centerX) ||
      (item.key === "football"   &&  item.x > this.world.centerX)) {
      this.sound.woosh.play();
      this.resetChain(item.key === "basketball" ? "hand" : "foot");
    }
  },
  grabGoodItemTween: function (playerPart) {
    this.add.tween(playerPart.scale)
      .to({x: 1.15, y: 1.15}, 200)
      .to({x: 1, y: 1}, 200)
      .start();
  },
  grabBadItemTween: function (playerPart) {
    this.add.tween(playerPart.scale)
      .to({x: 0.95, y: 0.95}, 200)
      .to({x: 1, y: 1}, 200)
      .start();
  },

  ////////////////////////////////////////////////////
  ///////////////// HEALTH
  ////////////////////////////////////////////////////

  initHealthBar: function () {
    var healthBar = {};
    healthBar.maxScale = (this.world.width - this.world.width / 6 - 12) / 16;
    healthBar.step = healthBar.maxScale / 9;

    healthBar.left = this.add.image(this.world.width / 12, this.world.height / 30, 'greenBarLeft');
    healthBar.left.scale.setTo(1, 0.7);
    healthBar.mid = this.add.image(healthBar.left.right, healthBar.left.top, 'greenBarMid');
    healthBar.mid.scale.setTo(healthBar.maxScale, 0.7);
    healthBar.right = this.add.image(healthBar.mid.right, healthBar.left.top, 'greenBarRight');
    healthBar.right.scale.setTo(1, 0.7);
    return healthBar;
  },
  decreaseHealth: function () {
    this.health -= 10;

    if(this.health === 0) this.gameOver();

    this.healthBar.mid.scale.x -= this.healthBar.step;
    this.healthBar.right.position.x = this.healthBar.mid.right;

  },
  increaseHealth: function (key) {
    if(this.health === 100) return;

    this.sound.heal.play();

    var newHealth = this.health + 10 * (this.chain[key] - 1);
    if(newHealth >= 100) {
      this.health = 100;
      this.healthBar.mid.scale.x = this.healthBar.maxScale;
      this.healthBar.right.position.x = this.healthBar.mid.right;
    }
    else {
      this.health = newHealth;
      this.healthBar.mid.scale.x += this.healthBar.step * (this.chain[key] - 1);
      this.healthBar.right.position.x = this.healthBar.mid.right;
    }
  },

  ////////////////////////////////////////////////////
  ///////////////// SCORE / CHAIN
  ////////////////////////////////////////////////////

  scorePoints: function (playerPart) {
    /*
     * called by handleOverlap
     * */

    this.score += this.chain[playerPart.key] * 10;
    this.scoreLabel.text = "score: " + this.score;
    this.increaseChain(playerPart.key);
    // this.decreaseDelay();

  },
  damagePlayer: function (playerPart) {
    /*
     * called by handleOverlap
     * */

    this.resetChain(playerPart.key);
    this.decreaseHealth();
  },
  increaseChain: function(key){
    /*
     * called by scorePoints
     * */

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
        this.increaseHealth(key);
      }
      else {
        this.increaseChainBarLength(key);
      }
      this.chainLabel[key].text = "x" + this.chain[key];
    }
  },
  resetChain: function(key){
    /*
     * called by handleOutOfBounds
     * */
    this.chain[key] = 1;
    this.chainCount[key] = 1;
    this.resetChainBarLength(key);
    this.chainLabel[key].text = "x1";
  },
  initChainBars: function () {
    /*
     * called @ create
     * */
    var hand = {}, foot = {}, dimensions = {};
    hand.left = this.add.image(this.world.width/12, this.world.height/8, 'redBarLeft');
    hand.left.scale.setTo(1, 0.6);
    hand.mid = this.add.image(hand.left.right, hand.left.top, 'redBarMid');
    hand.mid.scale.setTo(0, 0.6);
    hand.right = this.add.image(hand.mid.right, hand.left.top, 'redBarRight');
    hand.right.scale.setTo(1, 0.6);

    foot.left = this.add.image(this.world.centerX + this.world.width/12, this.world.height/8, 'redBarLeft');
    foot.left.scale.setTo(1, 0.6);
    foot.mid = this.add.image(foot.left.right, foot.left.top, 'redBarMid');
    foot.mid.scale.setTo(0, 0.6);
    foot.right = this.add.image(foot.mid.right, foot.left.top, 'redBarRight');
    foot.right.scale.setTo(1, 0.6);

    dimensions.maxScale = (this.world.width/2 - this.world.width/6 - 12) / 16;
    dimensions.scaleDelta = dimensions.maxScale / 5;

    return {
      hand: hand, foot: foot, dimensions: dimensions
    }

  },
  increaseChainBarLength: function (key) {
    /*
     * called by increaseChain
     * */
     this.chainBars[key].mid.scale.x += this.chainBars.dimensions.scaleDelta;
     this.chainBars[key].right.position.x = this.chainBars[key].mid.right;
  },
  resetChainBarLength: function (key) {
    /*
     * called by increaseChain and resetChain
     * */
     this.chainBars[key].mid.scale.x = 0;
     this.chainBars[key].right.position.x = this.chainBars[key].mid.right;
  },

  ////////////////////////////////////////////////////
  ///////////////// SOUND
  ////////////////////////////////////////////////////

  initSounds: function () {
    var sound = {};
    sound.good = this.add.audio('good');
    sound.bad = this.add.audio('bad');
    sound.gameOver = this.add.audio('gameOver');
    sound.woosh = this.add.audio('woosh');
    sound.heal = this.add.audio('heal');
    sound.music = this.add.audio('music');
    return sound;
  },

  ////////////////////////////////////////////////////
  ///////////////// GAME OVER
  ////////////////////////////////////////////////////

  gameOver: function () {
    this.sound.gameOver.play();
    this.sound.music.stop();
    this.state.start('Menu');
  }

};
