export class Piece {
    constructor(piece){
    // constructor(player_key, piece_key, canvas_DOM_id, board){
        this.key = piece.key;
        this.tile_key = piece.tile_key;
        this.player_key = piece.player_key;
        this.is_crowned = false;
        this.jump_count = 0;
        this.is_active = true;

        // board.subscriptions.pieces.push(this);
    }
}
