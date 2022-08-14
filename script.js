import {Game} from './modules/game.js';
import {Piece} from './modules/pieces.js';
import {Player} from './modules/player.js';
import {Tile} from './modules/tiles.js';

const game = {};

initGame();
setupCanvases();
drawGame();

startGame();

// Functions

function initGame(){
    game.started = false;
    game.status = "Initializing";
    game.player_turn = 0;
    game.tiles = initTiles();
    game.players = initPlayers();
    game.step = "Initializing";
    game.selected_piece_key = NaN;
    game.allowed_movements = [];
    game.layers = ["board_layer", "piece_layer", "overlay_layer"];

    game.players[0].pieces = initPieces(game.tiles, game.players[0].key);
    game.players[1].pieces = initPieces(game.tiles, game.players[1].key);
}

function drawGame(){
    drawTiles("board_layer", game.tiles);
    drawPieces("piece_layer", game.tiles, game.players[0]);
    drawPieces("piece_layer", game.tiles, game.players[1]);
}

function updateBoard(){
    clearLayer("piece_layer");
    drawPieces("piece_layer", game.tiles, game.players[0]);
    drawPieces("piece_layer", game.tiles, game.players[1]);

    updateDisplay();
}

function updateDisplay(){
    let selected_display = document.getElementById("selected_display");
    let movement_display = document.getElementById("allowed_display");

    selected_display.innerHTML = "";
    movement_display.innerHTML = "";
    clearLayer("overlay_layer");

    // check if we have a selected piece
    if (!isNaN(game.selected_piece_key)){
        selected_display.innerHTML = game.selected_piece_key;
        // if so, draw movement layer
        let movements = "";
        for (let i = 0; i < game.allowed_movements.length; i++) {
            let allowed_move = game.allowed_movements[i].toString();
            if (movements == ""){
                movements = allowed_move;
            } else {
                movements = movements + ", " + allowed_move;
            }
        }
        movement_display.innerHTML = movements;
        drawMovementLayer("overlay_layer");
    } else {
        selected_display.innerHTML = "";
        movement_display.innterHTML = "";
    }
}

function startGame(){
    initPlayerTurn();
    updateBoard();
    game.started = true;
}

function drawMovementLayer(canvas_id){
    if (isNaN(game.selected_piece_key)) return;
    for (let i = 0; i < game.allowed_movements.length; i++) {
        const path_tile_key = game.allowed_movements[i];
        drawPath(canvas_id, path_tile_key);
    }
}

function clearLayer(canvas_id){
    const canvas = document.getElementById(canvas_id);
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawPath(canvas_id, path_tile_key){
    const ctx = document.getElementById(canvas_id).getContext("2d");
    const piece_tile = game.tiles[path_tile_key];
    const arc_x = 60 * (piece_tile.row_key + 1) - 60 / 2;
    const arc_y = (60 * (piece_tile.column_key + 1)) - 60 / 2;
    const player = game.players[game.player_turn];

    ctx.beginPath();
    ctx.arc(arc_x, arc_y, (30 / 3), 0, (Math.PI * 2));
    ctx.fillStyle = player.color;
    ctx.strokeStyle = player.color;
    ctx.fill();
    ctx.stroke();
}

function initPlayerTurn(){
    let player_name = document.getElementById("player_display");
    player_name.innerHTML = game.players[game.player_turn].color;
}

function updatePlayerTurn(){
    if (game.player_turn == 1) {
        game.player_turn = 0;
    } else {
        game.player_turn = 1;
    }
    initPlayerTurn();
}

function setupCanvases(){
    for (let i = 0; i < game.layers.length; i++) {
        const layer = game.layers[i];
        const canvas = document.getElementById(layer);
        canvas.height = canvas.width = (60 * 8);
        canvas.addEventListener('mousedown', function(){
            catchClick(event, canvas);
        }, false);
    }
};

function catchClick(e, c){
    let relativeX = e.clientX - c.offsetLeft;
    let relativeY = e.clientY - c.offsetTop;
    let clickInsideCanvas = ((relativeX > 0 && relativeX < c.width) && (relativeY > 0 && relativeY < c.height));

    if (!clickInsideCanvas) return;

    let tile_key = findTile(relativeX, relativeY);
    routeClickAction(tile_key);
    updateBoard();
}

function routeClickAction(tile_key){
    if (isNaN(game.selected_piece_key)) {
        checkForPiece(tile_key);
        return;
    }

    if (game.selected_piece_key == game.tiles[tile_key].piece_key) {
        clearSelectedPiece();
        return;
    } 
    
    if (game.allowed_movements.length !== 0) {
        updateMovements(tile_key, game.player_turn);
    }
}

function updateMovements(tile_key, player_key){
    for (let i = 0; i < game.allowed_movements.length; i++) {
        const path = game.allowed_movements[i];
        if (tile_key == path){
            let the_piece = game.players[game.player_turn].pieces[game.selected_piece_key];
            clearTile(the_piece.tile_key);
            the_piece.tile_key = tile_key;
            updateTile(the_piece.tile_key, true, game.selected_piece_key, player_key);
            clearSelectedPiece();
            updatePlayerTurn();
        }
    }    
}

function clearTile(target_tile_key){
    updateTile(target_tile_key, false, NaN, NaN);
}

function updateTile(target_tile_key, has_piece, piece_key, player_key){
    let tiles = game.tiles;
    tiles[target_tile_key].has_piece = has_piece;
    tiles[target_tile_key].piece_key = piece_key;
    tiles[target_tile_key].player_key = player_key;
}

function clearSelectedPiece(){
    game.selected_piece_key = NaN; // then remove the selected piece.
    game.allowed_movements = [];
}

function checkForPiece(tile_key){
    if (!game.tiles[tile_key].has_piece) return; 
    if (!game.tiles[tile_key].player_key == game.player_turn) return;

    let clicked_piece = game.players[game.player_turn].pieces[game.tiles[tile_key].piece_key];

    game.status = "Piece Selected";
    game.step = "Movement";

    game.selected_piece_key = clicked_piece.key;
    game.allowed_movements = initMovementPaths(game.selected_piece_key);

    if (game.allowed_movements.length > 0) return;

    // if (game.allowed_movements == undefined || game.allowed_movements.length == 0){
        // game.step = "Waiting player turn";
        // game.selected_piece_key = NaN;
        // game.status = "Waiting player turn";
    // }
}

function initMovementPaths(piece_key){
    let current_player_key = game.player_turn;
    let current_player = game.players[current_player_key];
    let piece = current_player.pieces[piece_key];
    let possible_movements = [];
    let allowed_movements = [];
    let possible_jumps = [];

    let this_row = game.tiles[piece.tile_key].column_key; // (dont ask...... i'll fix this another time)
    let next_row = this_row;

    if (game.player_turn == 0){
        next_row = this_row + 1;
        possible_movements.push(piece.tile_key + 7);
        possible_movements.push(piece.tile_key + 9);
    } else {
        next_row = this_row - 1;
        possible_movements.push(piece.tile_key - 7);
        possible_movements.push(piece.tile_key - 9);
    }

    //check if possible movements' tiles are playable.
    for (let i = 0; i < possible_movements.length; i++) {
        const movement = possible_movements[i];
        if (game.tiles[movement].has_piece && game.tiles[movement].player_key !== game.player_turn) {
            possible_jumps.push(movement);
            continue;
        };
        if (game.tiles[movement].column_key !== next_row) continue;
        allowed_movements.push(movement);
    }

    if (game.player_turn == 0){
        next_row = this_row + 2;
    } else {
        next_row = this_row - 2;
    };

    if (possible_jumps.length == 0) return allowed_movements;

    console.log(possible_jumps);
    
    for (let i = 0; i < possible_jumps.length; i++) {
        const jump = possible_jumps[i];
        if (game.tiles[jump].has_piece) continue;
        if (game.tiles[jump].column_key !== next_row) continue;
        allowed_movements.push(jump);
        
    }

    return allowed_movements;
}

function findTile(x, y){
    const tiles = game.tiles;
    for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        let tile_start_x = tile.x;
        let tile_end_x = tile.x + 60;
        let tile_start_y = tile.y;
        let tile_end_y = tile.y + 60;

        let is_x_within_tile = (x >= tile_start_x && x < tile_end_x);
        let is_y_within_tile = (y >= tile_start_y && y < tile_end_y);

        let is_point_in_tile = (is_x_within_tile && is_y_within_tile);

        if (!is_point_in_tile) continue;

        console.log(tile.key);
        return tile.key;
    }
}

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

function initTiles(){
    const configs = {
        columns: ["A","B","C","D","E","F","G","H"],
        rows: ["1","2","3","4","5","6","7","8"]
    };    
    let key = 0;
    let tiles = [];

    for (let column = 0; column < configs.columns.length; column++) {
        const new_column = configs.columns[column];
        for (let row = 0; row < configs.rows.length; row++) {
            const new_row = configs.rows[row];
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
    let starting_tiles = [];
    if (player_key == 0){
        starting_tiles = [1,3,5,7,8,10,12,14,17,19,21,23,25];
    } else {
        starting_tiles = [40,42,44,46,49,51,53,55,56,58,60,62,64];
    }

    for (let i = 0; i < 12; i++) {
        let piece = {
            key: i,
            player_key: player_key,
            tile_key: starting_tiles[i],
            // tile_key: linkPieceToTile(tiles, player_key),
        };

        tiles[piece.tile_key].has_piece = true;
        tiles[piece.tile_key].piece_key = i;
        tiles[piece.tile_key].player_key = player_key;
        player_pieces.push(new Piece(piece));
    };

    return player_pieces;

};

// function linkPieceToTile(tiles, player_key){
//     if (player_key == 0) {
//         for (let k = 0; k < tiles.length; k++) {
//             let tile = tiles[k];
//             if (!tile.is_path) continue;
//             if (tile.has_piece) continue;
//             tiles.has_piece = true;
//             return tile.key;
//         }
//     } else {
//         for (let k = (tiles.length - 1); k > 0; k--) {
//             let tile = tiles[k];
//             if (!tile.is_path) continue;
//             if (tile.has_piece) continue;
//             tiles.has_piece = true;
//             return tile.key;
//         }        
//     }
// }

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
    ctx.fillRect(tile.x, tile.y, 60, 60);
}

function drawPieces(canvas_id, tiles, player){
    for (let i = 0; i < player.pieces.length; i++) {
        const piece = player.pieces[i];
        drawPiece(canvas_id, tiles, player, piece);
    }
}

function drawPiece(canvas_id, tiles, player, piece){
    const ctx = document.getElementById(canvas_id).getContext("2d");
    const piece_tile = tiles[piece.tile_key];
    const arc_x = 60 * (piece_tile.row_key + 1) - 60 / 2;
    const arc_y = (60 * (piece_tile.column_key + 1)) - 60 / 2;

    ctx.beginPath();
    ctx.arc(arc_x, arc_y, (60 / 3), 0, (Math.PI * 2));
    ctx.fillStyle = player.color;
    ctx.strokeStyle = player.color;
    ctx.fill();
    ctx.stroke();

    if ((player.key == game.player_turn) && 
        (piece.key == game.selected_piece_key)) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = "white";
            ctx.stroke();            
    }
}

