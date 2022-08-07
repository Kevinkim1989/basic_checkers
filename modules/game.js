export class Game {
  constructor(canvas_DOM_id){
    this.board = {
      canvas_id: canvas_DOM_id,
      tile_size: 60,
      player_turn: "",
      status: "",
      // tiles: [],
      // selected_piece: [],
      // columns: [],
      // rows: []
    };
    // this.subscriptions = {
    //   pieces: [],
    //   players: []
    // };
    // this.board.canvas_size = 8 * this.board.tile_size;
  };

  initAll(canvas_id){
    this.initBoard();
    this.initTiles();
    for (let i = 0; i < this.board.tiles.length; i++) {
      const tile = this.board.tiles[i];
      this.drawTile(canvas_id, tile);
    };
    // this.initPlayers();
  }

  // initPlayers(){
  //   const player_count = 1;
  //   // const player_count = 2;
  //   for (let i = 0; i < player_count; i++) {
  //     const player = new Player(i);
  //     this.subscriptions.players.push(player);
  //   }
  // }

  initBoard(){
    for (let index = 1; index < 9; index++) {
      const column = this.getLetter(index);
      this.board.columns.push(column);
    };
    for (let index = 0; index < 8; index++) {
      const row = index.toString();
      this.board.rows.push(row);
    }
  };

  // initTiles(){
  //   let tile_key = 0;
  //   for (let i = 0; i < this.board.rows.length; i++) {

  //     for (let k = 0; k < this.board.columns.length; k++) {
  //       let tile = new Tile(this.board);
  //       tile.key = tile_key;
  //       tile.x = i * this.board.tile_size;
  //       tile.row_name = this.board.rows[i];
  //       tile.column_name = this.board.columns[k]; 
  //       tile.row_key = this.board.rows.indexOf(this.board.rows[i]);
  //       tile.column_key = this.board.columns.indexOf(this.board.columns[k]); 
  //       tile.y = k * this.board.tile_size;

  //       if (i % 2) { // odd row
  //         tile.is_path = ((k % 2) == 0) // odd columns are playable tiles
  //       } else { // even row
  //         tile.is_path = ((k % 2) !== 0 ) // even columns 
  //       }

  //       this.board.tiles.push(tile);
  //       tile_key++;
  //     }
  //   }
  // };

  drawTile(canvas_id, tile){
    const canvas = document.getElementById(canvas_id);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = tile.is_path ? "black" : "white";
    ctx.fillRect(tile.x, tile.y, this.board.tile_size, this.board.tile_size);
  }

  drawPieces(canvas_id, pieces){
    const canvas = document.getElementById(canvas_id);
    const ctx = canvas.getContext("2d");

    let radius = this.board.tile_size / 3;
    let startAngle = 0;
    let endAngle = Math.PI * 2;

// console.log(pieces);

    pieces.forEach(piece => {
      let col_key = this.board.tiles[piece.key].column_key;
      let row_key = this.board.tiles[piece.key].row_key;

      let arc_x = this.board.tile_size * (col_key + 1) - this.board.tile_size / 2;
      let arc_y = (this.board.tile_size * (row_key + 1)) - this.board.tile_size / 2;
      
      ctx.beginPath();
      ctx.arc(arc_x, arc_y, radius, startAngle, endAngle);
      ctx.fillStyle = this.subscriptions.players[piece.player_key].color;
      ctx.fill();

    });
  }

  getLetter(num){
    var letter = String.fromCharCode(num + 64);
    return letter;
  }

};

// class Tile {
//   constructor(board){
//     this.key;
//     this.x;
//     this.y;
//     this.row_key;
//     this.column_key;
//     this.is_path; // that a piece can be placed on.
//     this.has_piece = false;
//   }
// }



