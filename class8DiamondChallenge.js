//start your code here
var game = new Phaser.Game(400, 300);

var player;
var platforms;
var hazards;
var hazardSound;
var coins;
var coinSound;
var tween1;
var coinsLeft = 3;

// For Welcome State
var startWelcomeState = true;

var playState = {};
var victoryState = {};
var defeatState = {};
var welcomeState = {};

playState.preload = function() {  
  game.load.crossOrigin = "anonymous";
  game.load.image("background", "https://cdn.glitch.com/07341419-e9df-484f-820f-d6799646cfcd%2Fclouds-h.png?1540814965305"); 
  game.load.spritesheet("player", "https://cdn.glitch.com/5d318c12-590d-47a1-b471-92a5dc0aae9d%2Fhero.png?1539353651099", 36, 42); 
  game.load.image("ground", "https://cdn.glitch.com/5d318c12-590d-47a1-b471-92a5dc0aae9d%2Fground.png");
  game.load.image("grass:4x1", "https://cdn.glitch.com/5d318c12-590d-47a1-b471-92a5dc0aae9d%2Fgrass_4x1.png");
  game.load.spritesheet("coin", "https://cdn.glitch.com/5d318c12-590d-47a1-b471-92a5dc0aae9d%2Fcoin_animated.png", 22, 22);
  game.load.audio("coinwav", "https://cdn.glitch.com/f555a7cf-4ed2-4768-8167-e545853a6981%2Fct_coin_1.wav");
  game.load.spritesheet("hazard", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/1171931/fire2.png", 11, 27);
  game.load.audio('hazardwav', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1171931/splat.wav');
  game.load.spritesheet('enemy', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1171931/mimic.png', 32, 32);
};

playState.create = function() {
  
  // The purpose of the code below is to make sure the welcomeState only plays once, at the beginning of the game
  if (startWelcomeState === true){
    game.state.start("welcomeState");
    // Only starts once, so changes startWelcomeState to false after the display of the Welcome State
    startWelcomeState = false;
  }
  
  coinsLeft = 3;
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.world.enableBody = true;
  
  game.add.sprite(0, 0, "background");
  player = game.add.sprite(0, 0, "player");
  
  player.body.gravity.y = 500;
  player.body.collideWorldBounds=true;

  player.anchor.set(0.5, 0.5);
  player.animations.add("stop", [0]);
  player.animations.add("run", [1, 2], 8, true); // 8fps looped
  player.animations.play("stop");

  platforms = game.add.group(); 
  platforms.enableBody = true;

  var ground = platforms.create(0, 275, 'ground');
  ground.body.immovable = true;

  var platform1 = platforms.create(150, 220, 'grass:4x1'); 
  platform1.body.immovable = true; 
  
  var platform2 = platforms.create(250, 150, 'grass:4x1');
  platform2.body.immovable = true;

  var platform3 = platforms.create(75, 100, 'grass:4x1'); 
  platform3.body.immovable = true;

  coins = game.add.group();
  coins.enableBody = true;

  for (var i = 1 ; i<4 ; i = i+1){
	var coin = coins.create(i * 100, 0, "coin");
    coin.body.gravity.y = 200;
    coin.animations.add("rotate", [0, 1, 2, 1], 6, true);
    coin.animations.play("rotate");
  }

  coinSound = game.add.audio('coinwav');

  hazards = game.add.group();
  hazards.enableBody = true;
  
  var flame = hazards.create(100, 250, 'hazard');
  flame.animations.add("flicker", [0, 1], 6, true);
  flame.animations.play("flicker");
  hazardSound = game.add.audio('hazardwav');

  var monster = hazards.create(250, 115, 'enemy');
  monster.animations.add('monster-move', [0,1,2,3,4,5,6,7,8,9,10], 6, true); 
  monster.animations.play('monster-move');

  tween1 = game.add.tween(monster);
  tween1.to({x:300, y: 115}, 1000, null, true, 0,-1,true);

};

playState.update = function() {
  
  game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(coins, platforms);
  game.physics.arcade.overlap(player, coins, collectCoins);
  game.physics.arcade.overlap(player, hazards, hitHazard);

  if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        player.body.velocity.x = 200;
        player.animations.play("run");
        player.scale.x = 1;
    }else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        player.body.velocity.x = -200;
        player.animations.play("run");
        player.scale.x = -1;
    } else {
        player.body.velocity.x = 0;
        player.animations.play("stop");
    }
  
    if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
        if(player.body.touching.down === true){
            player.body.velocity.y = -400;  
        }
    }

};

var collectCoins = function (player, coin) {
    coin.kill();
    coinSound.play();

    // Game restart based on coins mechanism
    coinsLeft = coinsLeft - 1;
    if(coinsLeft == 0){
      game.state.start("victoryState");
    }
};

var hitHazard = function(player,hazard) { 
  player.kill();        
  hazardSound.play();
  game.state.start("defeatState");
};

// Victory State Starts Here...

victoryState.create = function () { 
    this.victoryText = game.add.text(70,135, "Victory Achieved !!!");
    this.victoryText.fill = "#ffffff";
    this.time.events.add(3000, this.restart, this);
};

victoryState.restart = function(){
    game.state.start('play');
};

// Defeat State Starts Here ...

defeatState.create = function () { 
    this.defeatText = game.add.text(80,135, "Defeat Achieved !!!");
    this.defeatText.fill = "#ffffff";
    this.time.events.add(3000, this.restart, this);
};

defeatState.restart = function(){
    game.state.start('play');
};

// Welcome State Starts Here ...

welcomeState.preload = function() {  
  game.load.spritesheet('enemy', 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1171931/mimic.png', 32, 32);
};

welcomeState.create = function () { 
    this.welcomeText = game.add.text(50,135, "Welcome to the Game !!!");
    this.welcomeText.fill = "#ffffff";
    this.time.events.add(3140, this.restart, this);
    
    hazards = game.add.group();
    hazards.enableBody = true;
  
    var monster1 = hazards.create(50, 110, 'enemy');
    monster1.body.collideWorldBounds=true;
    monster1.animations.add('monster-move', [0,1,2,3,4,5,6,7,8,9,10], 6, true); 
    monster1.animations.play('monster-move');

    tween1 = game.add.tween(monster1);
    tween1.to({x:320, y: 110}, 1000, null, true, 0,-1,true);
    
    var monster2 = hazards.create(320, 160, 'enemy');
    monster2.body.collideWorldBounds=true;
    monster2.animations.add('monster-move', [0,1,2,3,4,5,6,7,8,9,10], 6, true); 
    monster2.animations.play('monster-move');

    tween1 = game.add.tween(monster2);
    tween1.to({x:50, y: 160}, 1000, null, true, 0,-1,true);
};

welcomeState.restart = function(){
    game.state.start('play');
};

game.state.add("play", playState);
game.state.add("welcomeState", welcomeState);
game.state.add("victoryState", victoryState);
game.state.add("defeatState", defeatState);
game.state.start("play");