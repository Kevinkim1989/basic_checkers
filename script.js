
const game = {
  board: "ok",
  tiles: [],
  teams: [],
  pieces: [],
  player_turn: 0,
  status: "",
  selected_piece: null,

  susbcribe_tile: function(x, y, width, height, tile_key, tile_row, tile_column, color){
    let is_play_tile = false;
    if (tile_row % 2 == 0) {
      is_play_tile = (tile_column % 2);
    } else {
      is_play_tile = (tile_column % 2 == 0);
    }
    const new_tile = {
      x: x,
      y: y,
      width: width,
      height: height,
      tile_key: tile_key,
      tile_row: tile_row,
      tile_column: tile_column,
      color: color,
      has_piece: false,
      piece_key: null,
      is_play_tile: is_play_tile
    };

    this.tiles.push(new_tile);
  },

  subscribe_team: function(key, name, color){
    if (this.teams.length >= 2) {
      console.log("can't add more than 2 teams");
      return;
    }
    first = 0;
    last = 24;

    if (key == 1) {
      first = 40;
      last = 64;
    }
    const new_team = {
      key: key,
      name: name,
      color: color,
      tile_span: [first, last]
    };

    this.teams.push(new_team);
  },

  subscribe_piece: function(tile_key, piece_key, team_key, color){
    const piece_type = "checker";
    const new_piece = {
      tile_key: tile_key,
      piece_key: piece_key,
      color: color,
      team_key: team_key,
      piece_type: piece_type
    };
    this.tiles[tile_key].has_piece = true;
    this.tiles[tile_key].piece_key = piece_key;
    this.pieces.push(new_piece);
  },

  find_tile: function(x, y){
    const tile = {
      tile_key: 0,
      has_piece: false,
      piece_key: 0,
      team_key: 0,
    };
    for (let i = 0; i < this.tiles.length; i++) {
      const current_tile = this.tiles[i];

      if (!(x >= current_tile.x && x <= current_tile.x + current_tile.width)){
        continue;
      };
      if (!(y >= current_tile.y && y <= current_tile.y + current_tile.height)){
        continue;
      };
      
      tile.tile_key = current_tile.tile_key;

      for (let k = 0; k < this.pieces.length; k++) {
        const current_piece = this.pieces[k];
        tile.has_piece = (current_piece.tile_key == tile.tile_key);
        if (!tile.has_piece) continue;
        tile.piece_key = current_piece.piece_key;
        tile.team_key = current_piece.team;
        return tile;
      }
      return tile;
    }
  }
};

const drawBoard2 = () => {
  const step = 60;
  const c = document.getElementById("gamewindow2");
  c.height = c.width = step * 8;
  const ctx = c.getContext("2d");
  for (let row = 0; row < 8; row++) {
    for (let column = 0; column < 8; column++) {
      let color = "rgba(" + (row * 50) + ", " + (column * 50) + ", 200, 0.5)";//(row + column) & 1 ? "black" : "white";
      let x = column * step;
      let y = row * step;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, step, step);
    }
  }
}

const init_movement_overlay = () => {
  const step = 60;
  const c = document.getElementById("gamewindow2");
  c.height = c.width = step * 8;
  const ctx = c.getContext("2d");
  for (let row = 0; row < 8; row++) {
    for (let column = 0; column < 8; column++) {
      let color = "rgba(0, 0, 0, 0)";//(row + column) & 1 ? "black" : "white";
      let x = column * step;
      let y = row * step;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, step, step);
    }
  }
}

const draw_movement_overlay = (tiles) => {
  console.log(tiles);
  const step = 60;
  const c = document.getElementById("gamewindow2");
  c.height = c.width = step * 8;
  const ctx = c.getContext("2d");
  for (let i = 0; i < tiles.length; i++) {
    const current_tile = game.tiles[tiles[i]];
    let color = "rgba(245, 40, 145, 0.8)";    
    let x = current_tile.tile_column * step;
    let y = current_tile.tile_row * step;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, step, step);
  }
}

const drawBoard = () => {
  const step = 60;
  c.height = c.width = step * 8;
  const ctx = c.getContext("2d");
  let tile_key = 0;
  for (let row = 0; row < 8; row++) {
    for (let column = 0; column < 8; column++) {
      let color = (row + column) & 1 ? "black" : "white";
      let x = column * step;
      let y = row * step;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, step, step);
      game.susbcribe_tile(x, y, step, step, tile_key, row, column, color);
      tile_key++;
    }
  }
};
  
const init_pieces_overlay = () => {
  const piece_layer = document.getElementById("piece_layer");
  const step = 60;
  piece_layer.height = piece_layer.width = step * 8;

  const ctx = piece_layer.getContext("2d");

  const teams = ["red","blue"];
  for (let i = 0; i < teams.length; i++) {
    const team_color = teams[i];
    game.subscribe_team(i, team_color, team_color);
    init_pieces(i, team_color);
    update_pieces(ctx, i);
  }
}

const init_pieces = (team_key) => {
  const team_color = game.teams[team_key].color;
  const team_tile_span = game.teams[team_key].tile_span;
  let piece_key = 0;
  for (let i = 0; i < game.tiles.length; i++) {
    const current_tile = game.tiles[i];
    if (!current_tile.is_play_tile) continue;
    if (current_tile.tile_key <  team_tile_span[0]
     || current_tile.tile_key >= team_tile_span[1]) continue;
    game.subscribe_piece(current_tile.tile_key, piece_key, team_key, team_color);
    piece_key++;
  }

};

const update_pieces = (ctx, team_key) => {
  console.log(game.teams[team_key].color);
  ctx.fillStyle = game.teams[team_key].color;
  let step = 60; // tile_size;
  const team_tile_span = game.teams[team_key].tile_span;
  let piece_key = 0;

  // Piece sizing
  let radius = step / 3;
  let startAngle = 0;
  let endAngle = Math.PI * 2;

  for (let i = 0; i < game.pieces.length; i++) {
    const current_piece = game.pieces[i];
    const current_tile = game.tiles[current_piece.tile_key];

    if (current_piece.team_key !== team_key) continue;

    let arc_x = current_tile.width * (current_tile.tile_column + 1) - step / 2;
    let arc_y = (step * (current_tile.tile_row + 1)) - step / 2;

    ctx.beginPath();
    ctx.arc(arc_x, arc_y, radius, startAngle, endAngle);
    ctx.fill();

    // game.subscribe_piece(current_tile.tile_key, piece_key, team_key, color);
    // piece_key++;
  }  
}

const c = document.getElementById("gamewindow");

drawBoard();
init_pieces_overlay();
init_movement_overlay();


document.addEventListener("mousedown", mousedownHandler, false);

function mousedownHandler(e){
  var relativeX = e.clientX - c.offsetLeft;
  var relativeY = e.clientY - c.offsetTop;
  if ((relativeX > 0 && relativeX < c.width) 
   && (relativeY > 0 && relativeY < c.height)) {
     
     let tile = game.find_tile(relativeX, relativeY);

      if (game.status == "") {
        if (!tile.has_piece) return;
        game.status = "movement";
        game.selected_piece = tile.piece_key;
        let movements = [];
        movements = get_movements(tile.piece_key);
        
        draw_movement_overlay(movements);
      } else if (game.status == "movement"){
        // update the piece to new tile, update pieces.
        console.log(tile.tile_key);
        console.log(game.pieces[game.selected_piece]);
        game.pieces[game.selected_piece].tile_key = tile.tile_key;

        const piece_layer = document.getElementById("piece_layer");
        const step = 60;
        piece_layer.height = piece_layer.width = step * 8;
      
        const ctx = piece_layer.getContext("2d");
        update_pieces(ctx, game.pieces[game.selected_piece].team_key);
        game.status = "";
      }

  }
};


function get_movements(piece_key){
  let team_key = game.pieces[piece_key].team_key;
  let tile_key = game.pieces[piece_key].tile_key;
  let movements = [];
  if (team_key == 0){
    let next_row = game.tiles[tile_key].tile_row + 1;
    movements = audit_row_for_movements(next_row, piece_key, movements);

  } else {
    // moves up towards row 0
  }

  return movements;
}

function audit_row_for_movements(row, player_piece_key, temp_movements){

  let player_team_key = game.pieces[player_piece_key].team_key
  for (let i = 0; i < game.tiles.length; i++) {
    const current_tile = game.tiles[i];

    if (current_tile.tile_row !== row) continue;
    if (!current_tile.is_play_tile) continue;

    let player_tile_column = game.tiles[game.pieces[player_piece_key].tile_key].tile_column;

    if (current_tile.tile_column >= (player_tile_column + 2)) continue;
    if (current_tile.tile_column <= (player_tile_column - 2)) continue;

    if (!current_tile.has_piece) {
      temp_movements.push(current_tile.tile_key);
      continue;
    }
    
    if (piece_team == player_team_key) continue;

    // if tile has a piece, then we might be able to chain a jump...
    let next_row = row + 1;
    let current_piece_key = current_tile.piece_key;
    
    temp_movements = audit_tiles_for_movement(next_row, current_piece_key, temp_movements);
  }


  return temp_movements;
}
