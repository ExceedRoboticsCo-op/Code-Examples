//start your code here
var game = new Phaser.Game(400, 300);

var player;
var platforms;
var coins;
var coinSound;
var jumpSound;
var playState = {};  



playState.preload = function() {  
  game.load.crossOrigin = "anonymous";
  game.load.image("background", "https://cdn.glitch.com/07341419-e9df-484f-820f-d6799646cfcd%2Fclouds-h.png?1540814965305"); 
  game.load.spritesheet("player", "https://cdn.glitch.com/5d318c12-590d-47a1-b471-92a5dc0aae9d%2Fhero.png?1539353651099", 36, 42); 
  game.load.image("ground", "https://cdn.glitch.com/5d318c12-590d-47a1-b471-92a5dc0aae9d%2Fground.png");
  game.load.image("grass:4x1", "https://cdn.glitch.com/5d318c12-590d-47a1-b471-92a5dc0aae9d%2Fgrass_4x1.png");
  game.load.spritesheet("coin", "https://cdn.glitch.com/5d318c12-590d-47a1-b471-92a5dc0aae9d%2Fcoin_animated.png", 22, 22);
  game.load.audio("coinwav", "https://cdn.glitch.com/f555a7cf-4ed2-4768-8167-e545853a6981%2Fct_coin_1.wav");
  game.load.audio("jumpwav", "https://cdn.glitch.global/638d5b26-ede0-4d92-8af9-1f36f0661db9/sound%20(1).wav?v=1648067734219");
};

playState.create = function() {
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
  jumpSound = game.add.audio('jumpwav');
};

playState.update = function() {
  
  game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(coins, platforms);
  game.physics.arcade.overlap(player, coins, collectCoins);

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
          jumpSound.play();
          player.body.velocity.y = -400;  
        }
    }

};

var collectCoins = function (player, coin) {
    coin.kill();
    coinSound.play();
};

game.state.add('play', playState);  
game.state.start('play');