export class Tile {
    constructor(tile){
        this.key = tile.key;
        this.x = 1;
        this.y = 1;
        this.row_key = tile.row_key;
        this.column_key = tile.column_key;
        this.row = tile.row;
        this.column = tile.column;
        this.has_piece = false;
        this.piece_key = NaN;
        this.player_key = NaN;

        this.is_path = this.checkIfPath(tile);
        this.color = (this.is_path) ? 'black' : 'red';
        
        this.x = this.row_key * 60;
        this.y = this.column_key * 60;
    }

    checkIfPath(tile){
        let row_key = tile.row_key;
        let column_key = tile.column_key;
        
        let row_is_even = true;
        let column_is_even = true;
        let tile_is_path = false;
        
        if (row_key % 2){
            row_is_even = false;
        } else {
            row_is_even = true;
        }
        
        if (column_key % 2){
            column_is_even = false;
        } else {
            column_is_even = true;
        }

        if (row_is_even){
            if (column_is_even) {
                tile_is_path = false;
            } else {
                tile_is_path = true;
            }
        } else {
            if (column_is_even) {
                tile_is_path = true;
            } else {
                tile_is_path = false;
            }
        }

        return tile_is_path;
    }
}
