// import Phaser from 'phaser';
var Phaser
async function load(){
  Phaser = await import(/* webpackChunkName: "vendors" */ 'phaser');
}

load().then(()=>{
  main();
});

function main () {
  var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600
  };

  var game = new Phaser.Game(config);
}

