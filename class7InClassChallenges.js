//start your code here
var game = new Phaser.Game(400, 300);

var player;
var platforms;
var hazards;
var hazardSound;
var coins;
var coinSound;
var tween1;

var playState = {};  
var coinsLeft = 3;

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
  game.load.image("ball", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAOhJREFUWEftlzEOgzAMRZu5CxeoxP1PhdQLsDC3ClJQAv4fW+A0qsJIHPvlx7bi8CDfMs8ftq5dew5DQLZw4a7geWAJ5ADgEZhBFADewRNIrsQGsA/+Gkfx2t7TJP632ieIFUA6udUhso/+EXSE+ClAhAvo3mso0AGoAtoud9UO5sBVx9r97QBIWW9tOqzmkf9VgRolh2J0gP9SACVtTE6aA9qa9bBrpw/ceTpLTzlVgD00pMZj7SkdAD7JUk64XwF6lNYA2B6lDMKqgKWaCoAzJSyONbbFXJBv8J6O9vNhe8OphxpsPP8CLsDtgrbncd4AAAAASUVORK5CYII=");
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
  
  var platform3 = platforms.create(300, 70, 'grass:4x1'); 
  platform3.body.immovable = true;

  coins = game.add.group();
  coins.enableBody = true;
  
  createCoin(380,100);
  createCoin(110,250);
  createCoin(250, 60);
  createCoin(100, 0);
  createCoin(200, 0);
  createCoin(300, 50);

  coinSound = game.add.audio('coinwav');

  hazards = game.add.group();
  hazards.enableBody = true;
  
  var flame = hazards.create(90, 250, 'hazard');
  flame.animations.add("flicker", [0, 1], 6, true);
  flame.animations.play("flicker");
  hazardSound = game.add.audio('hazardwav');

  var monster = hazards.create(70, 68, 'enemy');
  monster.animations.add('monster-move', [0,1,2,3,4,5,6,7,8,9,10], 6, true); 
  monster.animations.play('monster-move');

  tween1 = game.add.tween(monster);
  tween1.to({x:130, y: 68}, 2000, null, true, 0,-1,true);
  
  var monster1 = hazards.create(250, 115, 'enemy');
  monster1.animations.add('monster-move', [0,1,2,3,4,5,6,7,8,9,10], 6, true); 
  monster1.animations.play('monster-move');

  tween1 = game.add.tween(monster1);
  tween1.to({x:300, y: 115}, 3000, null, true, 0,-1,true);
  
  var ball = hazards.create(350,80, 'ball');
  
  tween1 = game.add.tween(ball);
  tween1.to({x:350, y: 240}, 500, null, true, 0,-1,true);
  
  var monster1 = hazards.create(295, 40, 'enemy');
  monster1.animations.add('monster-move', [0,1,2,3,4,5,6,7,8,9,10], 6, true); 
  monster1.animations.play('monster-move');

  tween1 = game.add.tween(monster1);
  tween1.to({x:350, y: 40}, 1500, null, true, 0,-1,true);
  

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
      game.state.restart("play");
    }
};

var hitHazard = function(player,hazard) { 
  player.kill();        
  hazardSound.play();
  game.state.restart();
};

var createCoin = function (positionX, positionY){
  var coin = coins.create(positionX, positionY, "coin");
  coin.body.gravity.y = 200;
  coin.animations.add("rotate", [0, 1, 2, 1], 6, true);
  coin.animations.play("rotate");
}


game.state.add('play', playState);  
game.state.start('play');