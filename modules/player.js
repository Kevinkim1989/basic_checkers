export class Player {
  constructor(player){
    this.key = player.key;
    this.color = (player.key % 2) ? "red" : "blue";
    this.pieces = [];
  }
}
