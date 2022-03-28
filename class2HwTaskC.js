var game = new Phaser.Game(400, 300);
var game1 = new Phaser.Game(400,300);

var player;
var playState = {};  
var playState1 = {};  

playState.preload = function() {  
  
  // First frame
  game.load.crossOrigin = "anonymous";
  game.load.image("background", "https://cdn.glitch.com/07341419-e9df-484f-820f-d6799646cfcd%2Fclouds-h.png?1540814965305"); 
  game.load.image("player", "https://cdn.glitch.com/5d318c12-590d-47a1-b471-92a5dc0aae9d%2Fhero_stopped.png?1539353651204");
};

playState.create = function() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.world.enableBody = true;

  
  game.add.sprite(0, 0, "background");
  player = game.add.sprite(0, 0, "player");
  
  player.body.gravity.y = 500;
  player.body.collideWorldBounds=true;

};

// Second frame
playState1.preload = function() {  
  game1.load.crossOrigin = "anonymous";
  game1.load.image("player", "https://cdn.glitch.com/5d318c12-590d-47a1-b471-92a5dc0aae9d%2Fhero_stopped.png?1539353651204");
};

playState1.create = function() {
  game1.physics.startSystem(Phaser.Physics.ARCADE);
  game1.world.enableBody = true;

  player = game1.add.sprite(0, 0, "player");
  
  player.body.gravity.y = 500;
  player.body.collideWorldBounds=true;

};

game.state.add('play', playState);  
game.state.start('play');
game1.state.add('play', playState1);  
game1.state.start('play');