import {Game} from './modules/game.js';
import {Piece} from './modules/pieces.js';
import {Player} from './modules/player.js';
import {Tile} from './modules/tiles.js';

const board_canvas = document.getElementById("board_layer");
const pieces_canvas = document.getElementById("piece_layer");
const overlay_canvas = document.getElementById("overlay_layer");
const configs = {
    columns: ["A","B","C","D","E","F","G","H"],
    rows: ["1","2","3","4","5","6","7","8"]
};
const game = {};
game.tiles = initTiles();
game.players = initPlayers();

game.players[0].pieces = initPieces(game.tiles, game.players[0].key);
game.players[1].pieces = initPieces(game.tiles, game.players[1].key);



setupCanvases();
drawTiles("board_layer", game.tiles);
drawPieces("piece_layer", game.tiles, game.players[0]);
drawPieces("piece_layer", game.tiles, game.players[1]);

// Functions

function drawTiles(board_canvas, tiles){
    for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        drawTile(board_canvas, tile);
    }
}

function drawTile(canvas_id, tile){
    const canvas = document.getElementById(canvas_id);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = tile.is_path ? "black" : "white";
    // ctx.fillRect(tile.x, tile.y, this.board.tile_size, this.board.tile_size);
    ctx.fillRect(tile.x, tile.y, 60, 60);
}

function drawPieces(canvas_id, tiles, player){
    const canvas = document.getElementById(canvas_id);
    const ctx = canvas.getContext("2d");

    let radius = 60 / 3;
    let startAngle = 0;
    let endAngle = Math.PI * 2;

    for (let i = 0; i < player.pieces.length; i++) {
        const piece = player.pieces[i];
        const piece_tile = tiles[player.pieces[i].tile_key];

        let column_key = piece_tile.column_key;
        let row_key = piece_tile.row_key;

        let arc_x = 60 * (column_key + 1) - 60 / 2;
        let arc_y = (60 * (row_key + 1)) - 60 / 2;

        ctx.beginPath();
        ctx.arc(arc_x, arc_y, radius, startAngle, endAngle);
        ctx.fillStyle = player.color;
        ctx.fill();
    }
}

function setupCanvases(){
    board_canvas.height = board_canvas.width = (60 * 8);
    pieces_canvas.height = pieces_canvas.width = (60 * 8);
    overlay_canvas.height = overlay_canvas.width = (60 * 8);
};

function initPlayers(){
    const player_count = 2;
    let players = [];
    for (let i = 0; i < player_count; i++) {
        const player = {
            key: i,
            name: "Player " + ( i + 1 ),
            pieces: [],
        };
        players.push(new Player(player)); 
    }
    return players;
};

// function initConfigs(){
//     for (let index = 1; index < 9; index++) {
//       const column = this.getLetter(index);
//       this.board.columns.push(column);
//     };
//     for (let index = 0; index < 8; index++) {
//       const row = index.toString();
//       this.board.rows.push(row);
//     }
// };

function initTiles(){
    let key = 0;
    let tiles = [];
    for (let row = 0; row < configs.rows.length; row++) {
        const new_row = configs.rows[row];
        for (let column = 0; column < configs.columns.length; column++) {
            const new_column = configs.columns[column];
            const tile = {
                key: key,
                column: new_column,
                row: new_row,
                column_key: column,
                row_key: row
            }
            tiles.push(new Tile(tile));
            key++;
        }
    }
    return tiles;
}

function initPieces(tiles, player_key){
    let player_pieces = [];
    for (let i = 0; i < 12; i++) {
        let piece = {
            key: i,
            player_key: player_key,
            tile_key: linkPieceToTile(tiles, player_key),
        };

        tiles[piece.tile_key].has_piece = true;
        player_pieces.push(new Piece(piece));
    };
    return player_pieces;
};

function linkPieceToTile(tiles, player_key){
    if (player_key == 0) {
        for (let k = 0; k < tiles.length; k++) {
            let tile = tiles[k];
            if (!tile.is_path) continue;
            if (tile.has_piece) continue;
            tiles.has_piece = true;
            return tile.key;
        }
    } else {
        for (let k = (tiles.length - 1); k > 0; k--) {
            let tile = tiles[k];
            if (!tile.is_path) continue;
            if (tile.has_piece) continue;
            tiles.has_piece = true;
            return tile.key;
        }        
    }
}
