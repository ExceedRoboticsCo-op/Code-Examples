var game = new Phaser.Game(400, 300);

var player;
var player1;
var playState = {};  

playState.preload = function() {  
  game.load.crossOrigin = "anonymous";
  game.load.image("background", "https://cdn.glitch.com/07341419-e9df-484f-820f-d6799646cfcd%2Fclouds-h.png?1540814965305"); 
  game.load.image("player", "https://cdn.glitch.com/5d318c12-590d-47a1-b471-92a5dc0aae9d%2Fhero_stopped.png?1539353651204");
};

playState.create = function() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  game.world.enableBody = true;

  
  game.add.sprite(0, 0, "background");
  player = game.add.sprite(0, 0, "player");
  player1 = game.add.sprite(400, 0, "player");
  
  player.body.gravity.y = 500;
  player.body.collideWorldBounds=true;
  
  player1.body.gravity.y = 100;
  player1.body.collideWorldBounds=true;

};

playState.update = function(){
  
}



game.state.add('play', playState);  
game.state.start('play');